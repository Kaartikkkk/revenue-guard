// Environment configuration with type safety
export const config = {
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    // Agent defaults
    maxRetryAttempts: 3,
    retryBackoffMs: [60000, 300000, 900000], // 1min, 5min, 15min
    humanGateThreshold: 500000, // ₹5,000 in paise
    dailyBudgetCap: 10000000, // ₹1,00,000 in paise
    weeklyBudgetCap: 50000000, // ₹5,00,000 in paise
    monthlyBudgetCap: 150000000, // ₹15,00,000 in paise
    cooldownPeriodMs: 3600000, // 1 hour between retries
  },
} as const;

export function validateConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!config.razorpay.keyId) missing.push('RAZORPAY_KEY_ID');
  if (!config.razorpay.keySecret) missing.push('RAZORPAY_KEY_SECRET');
  if (!config.gemini.apiKey) missing.push('GEMINI_API_KEY');
  return { valid: missing.length === 0, missing };
}
