import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { FailedPayment, RecoveryMessage, DiagnosisResult } from '../types';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  }
  return genAI;
}

// ============================================================
// Template-based fallback messages
// ============================================================

const TEMPLATES: Record<string, RecoveryMessage> = {
  insufficient_funds: {
    subject: 'Complete your pending payment',
    body: `Hi {{name}},\n\nWe noticed your recent payment of ₹{{amount}} could not be processed. This sometimes happens with temporary account issues.\n\nYou can complete your payment easily using the link below. We've kept your order ready for you!\n\n{{link}}\n\nIf you have any questions, feel free to reach out to us.\n\nBest regards,\nThe Team`,
    tone: 'friendly',
    paymentLinkText: 'Complete Payment',
  },
  card_declined: {
    subject: 'Payment update needed for your order',
    body: `Hi {{name}},\n\nYour payment of ₹{{amount}} was declined by your bank. This can happen for various reasons.\n\nPlease try again using a different payment method — we support UPI, cards, netbanking, and wallets.\n\n{{link}}\n\nNeed help? We're here for you.\n\nBest regards,\nThe Team`,
    tone: 'friendly',
    paymentLinkText: 'Try Again',
  },
  expired_card: {
    subject: 'Your card needs updating',
    body: `Hi {{name}},\n\nYour payment of ₹{{amount}} could not be processed as the card on file appears to have expired.\n\nPlease use the secure link below to complete your payment with an updated card or alternative method.\n\n{{link}}\n\nThank you for your patience!\n\nBest regards,\nThe Team`,
    tone: 'formal',
    paymentLinkText: 'Update & Pay',
  },
  network_error: {
    subject: 'Your payment is being retried',
    body: `Hi {{name}},\n\nWe experienced a temporary technical issue while processing your payment of ₹{{amount}}.\n\nDon't worry — we're automatically retrying the payment. You'll receive a confirmation once it's successful.\n\nIf you'd prefer to pay manually, you can use the link below:\n\n{{link}}\n\nThank you for your patience!\n\nBest regards,\nThe Team`,
    tone: 'friendly',
    paymentLinkText: 'Pay Manually',
  },
  default: {
    subject: 'Action needed: Complete your payment',
    body: `Hi {{name}},\n\nYour recent payment of ₹{{amount}} could not be processed.\n\nPlease use the secure link below to complete your payment:\n\n{{link}}\n\nIf you need any assistance, please don't hesitate to contact us.\n\nBest regards,\nThe Team`,
    tone: 'formal',
    paymentLinkText: 'Complete Payment',
  },
};

function getTemplateMessage(
  payment: FailedPayment,
  diagnosis: DiagnosisResult,
  paymentLinkUrl?: string
): RecoveryMessage {
  const template = TEMPLATES[diagnosis.category] || TEMPLATES.default;
  const name = payment.customer_name || 'Valued Customer';
  const amount = (payment.amount / 100).toFixed(2);
  const link = paymentLinkUrl || '[Payment Link]';

  return {
    subject: template.subject,
    body: template.body
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{amount\}\}/g, amount)
      .replace(/\{\{link\}\}/g, link),
    tone: template.tone,
    paymentLinkText: template.paymentLinkText,
  };
}

// ============================================================
// AI-generated personalized messages
// ============================================================

export async function generateRecoveryMessage(
  payment: FailedPayment,
  diagnosis: DiagnosisResult,
  paymentLinkUrl?: string
): Promise<RecoveryMessage> {
  if (!config.gemini.apiKey) {
    return getTemplateMessage(payment, diagnosis, paymentLinkUrl);
  }

  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a payment recovery communication specialist for an Indian e-commerce business.
Generate a personalized payment recovery email for a customer whose payment failed.

Context:
- Customer Name: ${payment.customer_name || 'Valued Customer'}
- Amount: ₹${(payment.amount / 100).toFixed(2)}
- Failure Reason: ${diagnosis.diagnosis}
- Failure Category: ${diagnosis.category}
- Retry Count: ${payment.retry_count} (previous attempts)
- Payment Method: ${payment.method || 'unknown'}
${paymentLinkUrl ? `- Payment Link: ${paymentLinkUrl}` : ''}

Guidelines:
- Be empathetic and professional
- Don't blame the customer
- Keep it concise (under 150 words for body)
- Include a clear call-to-action
- If retry count > 0, acknowledge previous attempts without being pushy
- Use ₹ for currency
- Don't use overly promotional language

Respond ONLY with a valid JSON object (no markdown, no code blocks):
{
  "subject": "email subject line",
  "body": "email body with \\n for line breaks",
  "tone": one of ["friendly", "urgent", "formal"],
  "paymentLinkText": "call-to-action button text"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    try {
      const cleanJson = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson) as RecoveryMessage;
      if (parsed.subject && parsed.body) {
        return parsed;
      }
    } catch {
      // Fall through to template
    }

    return getTemplateMessage(payment, diagnosis, paymentLinkUrl);
  } catch (error) {
    console.error('[MessageGen] Gemini error, using template:', error);
    return getTemplateMessage(payment, diagnosis, paymentLinkUrl);
  }
}
