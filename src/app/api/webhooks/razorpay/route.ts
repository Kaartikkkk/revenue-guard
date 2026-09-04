import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, parseWebhookEvent } from '@/lib/razorpay/webhooks';
import { processFailedPayment } from '@/lib/agent/recovery-agent';
import { insertAuditLog, getFailedPaymentByRazorpayId } from '@/lib/db/database';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Read the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // Step 1: Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      insertAuditLog({
        action: 'agent_error',
        details: {
          error: 'Invalid webhook signature',
          source: 'webhook_handler',
        },
      });

      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Step 2: Parse the event
    const event = parseWebhookEvent(body);
    if (!event) {
      return NextResponse.json(
        { error: 'Invalid event payload' },
        { status: 400 }
      );
    }

    // Step 3: Handle payment.failed events
    if (event.event === 'payment.failed') {
      const paymentEntity = event.payload.payment.entity;

      // Idempotency check
      const existing = getFailedPaymentByRazorpayId(paymentEntity.id);
      if (existing && existing.status !== 'failed') {
        return NextResponse.json({
          status: 'already_processing',
          message: `Payment ${paymentEntity.id} is already being processed`,
        });
      }

      // Process the failed payment through the recovery agent
      const result = await processFailedPayment(paymentEntity);

      return NextResponse.json({
        status: 'processed',
        result,
        processingTimeMs: Date.now() - startTime,
      });
    }

    // Handle payment.captured (recovery success!)
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;

      // Check if this is a recovered payment (via notes)
      const notes = paymentEntity.notes || {};
      if (notes.original_payment_id) {
        const originalPayment = getFailedPaymentByRazorpayId(notes.original_payment_id);
        if (originalPayment) {
          const { updatePaymentStatus } = await import('@/lib/db/database');
          updatePaymentStatus(originalPayment.id, 'recovered');

          insertAuditLog({
            failed_payment_id: originalPayment.id,
            action: 'retry_success',
            details: {
              recovered_payment_id: paymentEntity.id,
              amount: paymentEntity.amount,
              method: paymentEntity.method,
            },
          });
        }
      }

      return NextResponse.json({ status: 'captured_processed' });
    }

    // For other events, just acknowledge
    return NextResponse.json({
      status: 'acknowledged',
      event: event.event,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    insertAuditLog({
      action: 'agent_error',
      details: {
        error: errorMessage,
        source: 'webhook_handler',
        processingTimeMs: Date.now() - startTime,
      },
    });

    return NextResponse.json(
      { error: 'Internal server error', message: errorMessage },
      { status: 500 }
    );
  }
}
