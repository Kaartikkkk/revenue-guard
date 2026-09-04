import crypto from 'crypto';
import { config } from '../config';
import { WebhookEvent } from '../types';

/**
 * Verify Razorpay webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  if (!config.razorpay.webhookSecret) {
    console.warn('[Webhook] No webhook secret configured, skipping verification');
    return true; // Allow in dev/test mode
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('[Webhook] Signature verification error:', error);
    return false;
  }
}

/**
 * Parse and validate webhook event
 */
export function parseWebhookEvent(body: string): WebhookEvent | null {
  try {
    const event = JSON.parse(body) as WebhookEvent;

    // Basic validation
    if (!event.event || !event.payload) {
      console.error('[Webhook] Invalid event structure');
      return null;
    }

    return event;
  } catch (error) {
    console.error('[Webhook] Failed to parse event:', error);
    return null;
  }
}
