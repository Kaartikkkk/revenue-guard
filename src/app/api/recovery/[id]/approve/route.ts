import { NextRequest, NextResponse } from 'next/server';
import {
  getFailedPayment,
  updatePaymentStatus,
  insertAuditLog,
  getRecoveryAttempts,
  updateRecoveryAttempt,
} from '@/lib/db/database';
import { diagnoseFailure } from '@/lib/agent/failure-diagnostor';
import { selectStrategy } from '@/lib/agent/strategy-engine';
import { executeStrategy } from '@/lib/agent/recovery-agent';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'approve' or 'reject'

    const payment = getFailedPayment(id);
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'pending_approval') {
      return NextResponse.json(
        { error: `Payment is not pending approval (status: ${payment.status})` },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      insertAuditLog({
        failed_payment_id: payment.id,
        action: 'human_approved',
        details: {
          approvedBy: 'merchant',
          amount: payment.amount,
          timestamp: new Date().toISOString(),
        },
      });

      // Re-diagnose and execute the strategy
      const diagnosis = await diagnoseFailure(payment);
      const strategy = selectStrategy(payment, diagnosis);
      strategy.requiresApproval = false; // Already approved

      updatePaymentStatus(payment.id, 'recovering');
      const result = await executeStrategy(payment, diagnosis, strategy);

      return NextResponse.json({
        status: 'approved',
        result,
      });
    } else if (action === 'reject') {
      updatePaymentStatus(payment.id, 'abandoned');

      // Update any pending recovery attempts
      const attempts = getRecoveryAttempts(payment.id);
      for (const attempt of attempts) {
        if (attempt.status === 'pending') {
          updateRecoveryAttempt(attempt.id, {
            status: 'rejected' as 'failed',
            result: 'Rejected by merchant',
          });
        }
      }

      insertAuditLog({
        failed_payment_id: payment.id,
        action: 'human_rejected',
        details: {
          rejectedBy: 'merchant',
          amount: payment.amount,
          timestamp: new Date().toISOString(),
        },
      });

      return NextResponse.json({
        status: 'rejected',
        message: 'Recovery attempt rejected by merchant',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "approve" or "reject"' },
      { status: 400 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
