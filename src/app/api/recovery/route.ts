import { NextRequest, NextResponse } from 'next/server';
import { getAllFailedPayments, getRecoveryAttempts } from '@/lib/db/database';
import { PaymentStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as PaymentStatus | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const payments = getAllFailedPayments({
      status: status || undefined,
      limit,
      offset,
    });

    // Enrich with recovery attempts
    const enriched = payments.map((payment) => ({
      ...payment,
      recoveryAttempts: getRecoveryAttempts(payment.id),
      amountFormatted: `₹${(payment.amount / 100).toFixed(2)}`,
    }));

    return NextResponse.json({
      payments: enriched,
      total: enriched.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recovery data' },
      { status: 500 }
    );
  }
}
