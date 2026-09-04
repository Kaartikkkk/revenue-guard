import { DiagnosisResult, FailedPayment, RecoveryStrategy } from '../types';
import { getConfigValue } from '../db/database';

export interface StrategyDecision {
  strategy: RecoveryStrategy;
  reasoning: string;
  delay: number; // ms before executing
  requiresApproval: boolean;
  budgetImpact: number; // estimated cost in paise
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Determine the optimal recovery strategy based on diagnosis, payment context,
 * budget constraints, and retry history.
 */
export function selectStrategy(
  payment: FailedPayment,
  diagnosis: DiagnosisResult
): StrategyDecision {
  const humanGateThreshold = parseInt(getConfigValue('human_gate_threshold') || '500000');
  const maxRetries = parseInt(getConfigValue('max_retry_attempts') || '3');
  const autoRecoveryEnabled = getConfigValue('auto_recovery_enabled') === 'true';

  // Check if auto-recovery is disabled
  if (!autoRecoveryEnabled) {
    return {
      strategy: 'escalate',
      reasoning: 'Auto-recovery is disabled by merchant configuration. Escalating for human review.',
      delay: 0,
      requiresApproval: true,
      budgetImpact: 0,
      priority: 'medium',
    };
  }

  // Check if max retries exceeded
  if (payment.retry_count >= maxRetries) {
    return {
      strategy: 'escalate',
      reasoning: `Maximum retry attempts (${maxRetries}) reached. Escalating for human review. Previous ${payment.retry_count} attempts have failed.`,
      delay: 0,
      requiresApproval: true,
      budgetImpact: 0,
      priority: 'high',
    };
  }

  // Human gate for high-value transactions
  const requiresApproval = payment.amount >= humanGateThreshold;

  // Strategy selection based on diagnosis
  let decision: StrategyDecision;

  switch (diagnosis.recommendedStrategy) {
    case 'immediate_retry':
      decision = {
        strategy: 'immediate_retry',
        reasoning: `${diagnosis.reasoning}. The error is transient (${diagnosis.category}), and an immediate retry has a high probability of success. Attempt ${payment.retry_count + 1}/${maxRetries}.`,
        delay: Math.max(diagnosis.suggestedDelay, 30000), // At least 30s
        requiresApproval,
        budgetImpact: payment.amount,
        priority: diagnosis.riskLevel === 'high' ? 'critical' : 'high',
      };
      break;

    case 'delayed_retry':
      decision = {
        strategy: 'delayed_retry',
        reasoning: `${diagnosis.reasoning}. A delayed retry is recommended because the issue (${diagnosis.category}) may resolve with time. Scheduling retry after cooldown period. Attempt ${payment.retry_count + 1}/${maxRetries}.`,
        delay: Math.max(diagnosis.suggestedDelay, 300000), // At least 5 min
        requiresApproval,
        budgetImpact: payment.amount,
        priority: 'medium',
      };
      break;

    case 'payment_link':
      decision = {
        strategy: 'payment_link',
        reasoning: `${diagnosis.reasoning}. The original payment method cannot be retried (${diagnosis.category}). Creating a new payment link so the customer can complete payment with an alternative method.`,
        delay: 0,
        requiresApproval,
        budgetImpact: 0,
        priority: 'high',
      };
      break;

    case 'notification':
      decision = {
        strategy: 'notification',
        reasoning: `${diagnosis.reasoning}. Customer action is required to resolve this failure. Sending a personalized notification to guide them.`,
        delay: 0,
        requiresApproval: false, // Notifications don't need approval
        budgetImpact: 0,
        priority: 'medium',
      };
      break;

    case 'escalate':
    default:
      decision = {
        strategy: 'escalate',
        reasoning: `${diagnosis.reasoning}. This failure requires human judgment. The AI agent cannot confidently determine the best course of action.`,
        delay: 0,
        requiresApproval: true,
        budgetImpact: 0,
        priority: diagnosis.riskLevel === 'high' ? 'critical' : 'high',
      };
      break;
  }

  // Override: If confidence is too low, escalate
  if (diagnosis.confidence < 0.4 && decision.strategy !== 'escalate') {
    decision = {
      ...decision,
      strategy: 'escalate',
      reasoning: `[Low confidence override] AI confidence is only ${(diagnosis.confidence * 100).toFixed(0)}%, which is below the 40% threshold. Original recommendation was "${decision.strategy}" but escalating for safety. ${decision.reasoning}`,
      requiresApproval: true,
    };
  }

  return decision;
}

/**
 * Check if the daily budget cap has been exceeded
 */
export function checkBudgetCap(budgetUsedToday: number): {
  withinBudget: boolean;
  remaining: number;
  reasoning: string;
} {
  const dailyCap = parseInt(getConfigValue('daily_budget_cap') || '10000000');

  const remaining = dailyCap - budgetUsedToday;
  const withinBudget = remaining > 0;

  return {
    withinBudget,
    remaining,
    reasoning: withinBudget
      ? `Budget OK: ₹${(remaining / 100).toFixed(2)} remaining of ₹${(dailyCap / 100).toFixed(2)} daily cap.`
      : `BUDGET CAP HIT: Daily limit of ₹${(dailyCap / 100).toFixed(2)} exceeded. Used: ₹${(budgetUsedToday / 100).toFixed(2)}. All recovery actions suspended until tomorrow.`,
  };
}
