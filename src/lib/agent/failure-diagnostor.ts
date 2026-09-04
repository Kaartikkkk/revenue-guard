import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { DiagnosisResult, FailedPayment, FailureCategory } from '../types';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  }
  return genAI;
}

// ============================================================
// Rule-based fallback (used when Gemini is unavailable)
// ============================================================

const ERROR_CODE_MAP: Record<string, { category: FailureCategory; retryable: boolean; strategy: DiagnosisResult['recommendedStrategy'] }> = {
  'BAD_REQUEST_ERROR': { category: 'invalid_details', retryable: false, strategy: 'payment_link' },
  'GATEWAY_ERROR': { category: 'network_error', retryable: true, strategy: 'immediate_retry' },
  'SERVER_ERROR': { category: 'network_error', retryable: true, strategy: 'immediate_retry' },
  'PAYMENT_ERROR': { category: 'card_declined', retryable: false, strategy: 'payment_link' },
};

const ERROR_REASON_MAP: Record<string, { category: FailureCategory; retryable: boolean; strategy: DiagnosisResult['recommendedStrategy'] }> = {
  'insufficient_balance': { category: 'insufficient_funds', retryable: true, strategy: 'delayed_retry' },
  'card_declined': { category: 'card_declined', retryable: false, strategy: 'payment_link' },
  'expired_card': { category: 'expired_card', retryable: false, strategy: 'payment_link' },
  'authentication_failed': { category: 'authentication_failed', retryable: true, strategy: 'notification' },
  'network_error': { category: 'network_error', retryable: true, strategy: 'immediate_retry' },
  'bank_offline': { category: 'bank_error', retryable: true, strategy: 'delayed_retry' },
  'payment_cancelled': { category: 'authentication_failed', retryable: false, strategy: 'notification' },
};

function ruleBasedDiagnosis(payment: FailedPayment): DiagnosisResult {
  // Try to match by error reason first (more specific)
  const reasonMatch = payment.error_reason ? ERROR_REASON_MAP[payment.error_reason] : null;
  if (reasonMatch) {
    return {
      category: reasonMatch.category,
      diagnosis: `Payment failed due to: ${payment.error_description || payment.error_reason}`,
      confidence: 0.7,
      isRetryable: reasonMatch.retryable,
      recommendedStrategy: reasonMatch.strategy,
      reasoning: `[Rule-based] Matched error reason "${payment.error_reason}" to category "${reasonMatch.category}". ${reasonMatch.retryable ? 'This is a transient error that may succeed on retry.' : 'This requires customer action to resolve.'}`,
      suggestedDelay: reasonMatch.strategy === 'immediate_retry' ? 60000 : 300000,
      riskLevel: payment.amount > 500000 ? 'high' : payment.amount > 100000 ? 'medium' : 'low',
    };
  }

  // Fall back to error code
  const codeMatch = payment.error_code ? ERROR_CODE_MAP[payment.error_code] : null;
  if (codeMatch) {
    return {
      category: codeMatch.category,
      diagnosis: `Payment failed with error: ${payment.error_description || payment.error_code}`,
      confidence: 0.5,
      isRetryable: codeMatch.retryable,
      recommendedStrategy: codeMatch.strategy,
      reasoning: `[Rule-based] Matched error code "${payment.error_code}" to category "${codeMatch.category}".`,
      suggestedDelay: codeMatch.strategy === 'immediate_retry' ? 60000 : 300000,
      riskLevel: payment.amount > 500000 ? 'high' : payment.amount > 100000 ? 'medium' : 'low',
    };
  }

  // Unknown failure
  return {
    category: 'unknown',
    diagnosis: `Payment failed with unrecognized error: ${payment.error_description || 'Unknown error'}`,
    confidence: 0.3,
    isRetryable: false,
    recommendedStrategy: 'escalate',
    reasoning: '[Rule-based] Could not match error to any known category. Escalating for human review.',
    suggestedDelay: 0,
    riskLevel: 'high',
  };
}

// ============================================================
// AI-powered diagnosis using Gemini
// ============================================================

export async function diagnoseFailure(payment: FailedPayment): Promise<DiagnosisResult> {
  // If Gemini API key is not available, use rule-based fallback
  if (!config.gemini.apiKey) {
    console.warn('[Diagnostor] No Gemini API key, using rule-based fallback');
    return ruleBasedDiagnosis(payment);
  }

  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert payment failure diagnostor for Indian payment systems (UPI, cards, netbanking).
Analyze this failed payment and provide a structured diagnosis.

Payment Details:
- Amount: ₹${(payment.amount / 100).toFixed(2)}
- Method: ${payment.method || 'unknown'}
- Error Code: ${payment.error_code || 'none'}
- Error Description: ${payment.error_description || 'none'}
- Error Reason: ${payment.error_reason || 'none'}
- Retry Count: ${payment.retry_count}
- Currency: ${payment.currency}

Respond ONLY with a valid JSON object (no markdown, no code blocks) matching this exact structure:
{
  "category": one of ["network_error", "insufficient_funds", "card_declined", "expired_card", "authentication_failed", "bank_error", "invalid_details", "unknown"],
  "diagnosis": "Human-readable explanation of what went wrong",
  "confidence": number between 0 and 1,
  "isRetryable": boolean,
  "recommendedStrategy": one of ["immediate_retry", "delayed_retry", "payment_link", "notification", "escalate"],
  "reasoning": "Detailed explanation of your reasoning for the diagnosis and recommendation",
  "suggestedDelay": number in milliseconds (0 if not retrying),
  "riskLevel": one of ["low", "medium", "high"]
}

Consider:
- Network/gateway errors are usually transient and retryable immediately
- Insufficient funds may succeed later (e.g., on salary credit day)
- Expired/declined cards need customer to provide new payment method
- High amounts (>₹5000) are higher risk
- After 2+ retries, escalate rather than retry again`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Try to parse the JSON response
    let parsed: DiagnosisResult;
    try {
      // Remove potential markdown code blocks
      const cleanJson = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      console.warn('[Diagnostor] Failed to parse Gemini response, using rule-based fallback');
      return ruleBasedDiagnosis(payment);
    }

    // Validate the parsed result has required fields
    if (!parsed.category || !parsed.diagnosis || !parsed.recommendedStrategy) {
      console.warn('[Diagnostor] Incomplete Gemini response, using rule-based fallback');
      return ruleBasedDiagnosis(payment);
    }

    return {
      ...parsed,
      reasoning: `[AI-powered] ${parsed.reasoning}`,
    };
  } catch (error) {
    console.error('[Diagnostor] Gemini API error, falling back to rule-based:', error);
    const fallback = ruleBasedDiagnosis(payment);
    fallback.reasoning = `[Fallback - Gemini unavailable] ${fallback.reasoning}`;
    return fallback;
  }
}
