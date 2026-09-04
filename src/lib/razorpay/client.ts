import Razorpay from 'razorpay';
import { config } from '../config';

let razorpayInstance: Razorpay | null = null;

export function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      throw new Error('Razorpay API keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
    }
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }
  return razorpayInstance;
}

// ============================================================
// Retry wrapper with exponential backoff
// ============================================================

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, onRetry } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 500;
      if (onRetry) onRetry(error as Error, attempt);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('withRetry: exhausted all retries');
}

// ============================================================
// Payment operations
// ============================================================

export async function fetchPayment(paymentId: string) {
  const rz = getRazorpayClient();
  return withRetry(() => rz.payments.fetch(paymentId), {
    onRetry: (err, attempt) => {
      console.warn(`[Razorpay] Retry ${attempt} for fetchPayment(${paymentId}): ${err.message}`);
    },
  });
}

export async function createPaymentLink(data: {
  amount: number;
  currency?: string;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  expireByMinutes?: number;
  notes?: Record<string, string>;
}) {
  const rz = getRazorpayClient();

  const payload: Record<string, unknown> = {
    amount: data.amount,
    currency: data.currency || 'INR',
    description: data.description,
    notify: {
      email: !!data.customerEmail,
      sms: !!data.customerPhone,
    },
    reminder_enable: true,
    notes: data.notes || {},
    callback_url: `${config.app.url}/recovery/success`,
    callback_method: 'get',
  };

  if (data.customerName || data.customerEmail || data.customerPhone) {
    payload.customer = {
      name: data.customerName || '',
      email: data.customerEmail || '',
      contact: data.customerPhone || '',
    };
  }

  if (data.expireByMinutes) {
    payload.expire_by = Math.floor(Date.now() / 1000) + data.expireByMinutes * 60;
  }

  return withRetry(() => rz.paymentLink.create(payload as unknown as Parameters<typeof rz.paymentLink.create>[0]), {
    onRetry: (err, attempt) => {
      console.warn(`[Razorpay] Retry ${attempt} for createPaymentLink: ${err.message}`);
    },
  });
}

export async function fetchAllPayments(options?: {
  from?: number;
  to?: number;
  count?: number;
  skip?: number;
}) {
  const rz = getRazorpayClient();
  return withRetry(() => rz.payments.all(options || {}), {
    onRetry: (err, attempt) => {
      console.warn(`[Razorpay] Retry ${attempt} for fetchAllPayments: ${err.message}`);
    },
  });
}

export async function createOrder(data: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) {
  const rz = getRazorpayClient();
  return withRetry(
    () =>
      rz.orders.create({
        amount: data.amount,
        currency: data.currency || 'INR',
        receipt: data.receipt || `rcpt_${Date.now()}`,
        notes: data.notes || {},
      }),
    {
      onRetry: (err, attempt) => {
        console.warn(`[Razorpay] Retry ${attempt} for createOrder: ${err.message}`);
      },
    }
  );
}
