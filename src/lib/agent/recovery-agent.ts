import { v4 as uuidv4 } from 'uuid';
import {
  FailedPayment,
  RazorpayPaymentEntity,
  DiagnosisResult,
  RecoveryStrategy,
} from '../types';
import {
  insertFailedPayment,
  updatePaymentStatus,
  updateFailureCategory,
  incrementRetryCount,
  insertRecoveryAttempt,
  updateRecoveryAttempt,
  insertAuditLog,
  getConfigValue,
  getDashboardStats,
} from '../db/database';
import { diagnoseFailure } from './failure-diagnostor';
import { selectStrategy, checkBudgetCap, StrategyDecision } from './strategy-engine';
import { generateRecoveryMessage } from './message-generator';
import { createPaymentLink, createOrder } from '../razorpay/client';

export interface RecoveryResult {
  success: boolean;
  paymentId: string;
  strategy: RecoveryStrategy;
  message: string;
  details: Record<string, unknown>;
  requiresApproval: boolean;
}

/**
 * Main recovery agent - orchestrates the entire recovery flow
 * for a failed payment event.
 */
export async function processFailedPayment(
  paymentEntity: RazorpayPaymentEntity
): Promise<RecoveryResult> {
  const startTime = Date.now();

  // Step 1: Record the failed payment
  const failedPayment = insertFailedPayment({
    razorpay_payment_id: paymentEntity.id,
    razorpay_order_id: paymentEntity.order_id,
    amount: paymentEntity.amount,
    currency: paymentEntity.currency,
    customer_email: paymentEntity.email,
    customer_phone: paymentEntity.contact,
    customer_name: paymentEntity.notes?.customer_name || null,
    error_code: paymentEntity.error_code,
    error_description: paymentEntity.error_description,
    error_reason: paymentEntity.error_reason,
    method: paymentEntity.method,
  });

  // Log: Payment failed received
  insertAuditLog({
    failed_payment_id: failedPayment.id,
    action: 'payment_failed_received',
    details: {
      razorpay_payment_id: paymentEntity.id,
      amount: paymentEntity.amount,
      method: paymentEntity.method,
      error_code: paymentEntity.error_code,
      error_description: paymentEntity.error_description,
      timestamp: new Date().toISOString(),
    },
  });

  // If already being processed (duplicate webhook), skip
  if (failedPayment.status !== 'failed') {
    return {
      success: false,
      paymentId: failedPayment.id,
      strategy: 'escalate',
      message: `Payment ${failedPayment.razorpay_payment_id} is already being processed (status: ${failedPayment.status})`,
      details: { skipped: true, currentStatus: failedPayment.status },
      requiresApproval: false,
    };
  }

  try {
    // Step 2: Check budget cap
    const stats = getDashboardStats();
    const budgetCheck = checkBudgetCap(stats.budgetUsedToday);

    if (!budgetCheck.withinBudget) {
      insertAuditLog({
        failed_payment_id: failedPayment.id,
        action: 'budget_cap_hit',
        details: {
          budgetUsed: stats.budgetUsedToday,
          reasoning: budgetCheck.reasoning,
        },
      });

      updatePaymentStatus(failedPayment.id, 'abandoned');

      return {
        success: false,
        paymentId: failedPayment.id,
        strategy: 'escalate',
        message: budgetCheck.reasoning,
        details: { budgetCapHit: true, budgetUsed: stats.budgetUsedToday },
        requiresApproval: false,
      };
    }

    // Step 3: Diagnose the failure using AI
    updatePaymentStatus(failedPayment.id, 'recovering');
    const diagnosis = await diagnoseFailure(failedPayment);

    // Update failure category in DB
    updateFailureCategory(failedPayment.id, diagnosis.category);

    insertAuditLog({
      failed_payment_id: failedPayment.id,
      action: 'diagnosis_complete',
      details: {
        category: diagnosis.category,
        diagnosis: diagnosis.diagnosis,
        isRetryable: diagnosis.isRetryable,
        recommendedStrategy: diagnosis.recommendedStrategy,
        riskLevel: diagnosis.riskLevel,
      },
      ai_reasoning: diagnosis.reasoning,
      confidence_score: diagnosis.confidence,
    });

    // Step 4: Select optimal recovery strategy
    const strategyDecision = selectStrategy(failedPayment, diagnosis);

    insertAuditLog({
      failed_payment_id: failedPayment.id,
      action: 'strategy_selected',
      details: {
        strategy: strategyDecision.strategy,
        delay: strategyDecision.delay,
        requiresApproval: strategyDecision.requiresApproval,
        priority: strategyDecision.priority,
      },
      ai_reasoning: strategyDecision.reasoning,
    });

    // Step 5: If requires human approval, pause and wait
    if (strategyDecision.requiresApproval) {
      updatePaymentStatus(failedPayment.id, 'pending_approval');

      insertAuditLog({
        failed_payment_id: failedPayment.id,
        action: 'human_gate_triggered',
        details: {
          amount: failedPayment.amount,
          threshold: getConfigValue('human_gate_threshold'),
          strategy: strategyDecision.strategy,
          message: 'Transaction exceeds human-gate threshold. Awaiting merchant approval.',
        },
      });

      // Create the recovery attempt in pending state
      insertRecoveryAttempt({
        failed_payment_id: failedPayment.id,
        strategy: strategyDecision.strategy,
        attempt_number: failedPayment.retry_count + 1,
        diagnosis: diagnosis.diagnosis,
        reasoning: strategyDecision.reasoning,
      });

      return {
        success: true,
        paymentId: failedPayment.id,
        strategy: strategyDecision.strategy,
        message: `Recovery requires merchant approval (amount: ₹${(failedPayment.amount / 100).toFixed(2)} exceeds threshold). Awaiting approval.`,
        details: {
          pendingApproval: true,
          diagnosis: diagnosis.diagnosis,
          strategy: strategyDecision.strategy,
        },
        requiresApproval: true,
      };
    }

    // Step 6: Execute the recovery strategy
    return await executeStrategy(failedPayment, diagnosis, strategyDecision);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    insertAuditLog({
      failed_payment_id: failedPayment.id,
      action: 'agent_error',
      details: {
        error: errorMessage,
        processingTimeMs: Date.now() - startTime,
      },
    });

    updatePaymentStatus(failedPayment.id, 'failed');

    return {
      success: false,
      paymentId: failedPayment.id,
      strategy: 'escalate',
      message: `Agent error: ${errorMessage}`,
      details: { error: errorMessage },
      requiresApproval: false,
    };
  }
}

/**
 * Execute a recovery strategy
 */
export async function executeStrategy(
  payment: FailedPayment,
  diagnosis: DiagnosisResult,
  decision: StrategyDecision
): Promise<RecoveryResult> {
  const attempt = insertRecoveryAttempt({
    failed_payment_id: payment.id,
    strategy: decision.strategy,
    attempt_number: payment.retry_count + 1,
    diagnosis: diagnosis.diagnosis,
    reasoning: decision.reasoning,
  });

  try {
    switch (decision.strategy) {
      case 'immediate_retry':
      case 'delayed_retry': {
        // For demo purposes, we create a new order and payment link
        // In production, this would integrate with Razorpay's retry mechanism
        updateRecoveryAttempt(attempt.id, { status: 'in_progress' });

        insertAuditLog({
          failed_payment_id: payment.id,
          recovery_attempt_id: attempt.id,
          action: 'retry_initiated',
          details: {
            strategy: decision.strategy,
            delay: decision.delay,
            attemptNumber: payment.retry_count + 1,
          },
        });

        // Create a payment link for the retry
        const recoveryMessage = await generateRecoveryMessage(payment, diagnosis);

        try {
          const paymentLink = await createPaymentLink({
            amount: payment.amount,
            currency: payment.currency,
            description: `Recovery for payment ${payment.razorpay_payment_id}`,
            customerName: payment.customer_name || undefined,
            customerEmail: payment.customer_email || undefined,
            customerPhone: payment.customer_phone || undefined,
            expireByMinutes: 1440, // 24 hours
            notes: {
              recovery_attempt_id: attempt.id,
              original_payment_id: payment.razorpay_payment_id,
              recovery_type: decision.strategy,
            },
          });

          incrementRetryCount(payment.id);
          updateRecoveryAttempt(attempt.id, {
            status: 'success',
            result: `Payment link created: ${(paymentLink as Record<string, unknown>).short_url}`,
            payment_link_id: (paymentLink as Record<string, unknown>).id as string,
            payment_link_url: (paymentLink as Record<string, unknown>).short_url as string,
          });

          insertAuditLog({
            failed_payment_id: payment.id,
            recovery_attempt_id: attempt.id,
            action: 'payment_link_created',
            details: {
              paymentLinkId: (paymentLink as Record<string, unknown>).id,
              paymentLinkUrl: (paymentLink as Record<string, unknown>).short_url,
              message: recoveryMessage,
            },
          });

          return {
            success: true,
            paymentId: payment.id,
            strategy: decision.strategy,
            message: `Recovery payment link created successfully`,
            details: {
              paymentLinkUrl: (paymentLink as Record<string, unknown>).short_url,
              message: recoveryMessage,
            },
            requiresApproval: false,
          };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          incrementRetryCount(payment.id);
          updateRecoveryAttempt(attempt.id, {
            status: 'failed',
            result: `Failed to create payment link: ${errorMsg}`,
          });

          insertAuditLog({
            failed_payment_id: payment.id,
            recovery_attempt_id: attempt.id,
            action: 'retry_failed',
            details: { error: errorMsg },
          });

          return {
            success: false,
            paymentId: payment.id,
            strategy: decision.strategy,
            message: `Recovery failed: ${errorMsg}`,
            details: { error: errorMsg },
            requiresApproval: false,
          };
        }
      }

      case 'payment_link': {
        updateRecoveryAttempt(attempt.id, { status: 'in_progress' });

        try {
          const paymentLink = await createPaymentLink({
            amount: payment.amount,
            currency: payment.currency,
            description: `Complete your payment - ${payment.razorpay_payment_id}`,
            customerName: payment.customer_name || undefined,
            customerEmail: payment.customer_email || undefined,
            customerPhone: payment.customer_phone || undefined,
            expireByMinutes: 4320, // 72 hours
            notes: {
              recovery_attempt_id: attempt.id,
              original_payment_id: payment.razorpay_payment_id,
              recovery_type: 'payment_link',
            },
          });

          const recoveryMessage = await generateRecoveryMessage(
            payment,
            diagnosis,
            (paymentLink as Record<string, unknown>).short_url as string
          );

          updateRecoveryAttempt(attempt.id, {
            status: 'success',
            result: `Payment link sent to ${payment.customer_email}`,
            payment_link_id: (paymentLink as Record<string, unknown>).id as string,
            payment_link_url: (paymentLink as Record<string, unknown>).short_url as string,
          });

          insertAuditLog({
            failed_payment_id: payment.id,
            recovery_attempt_id: attempt.id,
            action: 'payment_link_created',
            details: {
              paymentLinkId: (paymentLink as Record<string, unknown>).id,
              paymentLinkUrl: (paymentLink as Record<string, unknown>).short_url,
              sentTo: payment.customer_email,
              message: recoveryMessage,
            },
          });

          insertAuditLog({
            failed_payment_id: payment.id,
            recovery_attempt_id: attempt.id,
            action: 'notification_sent',
            details: {
              channel: 'email',
              recipient: payment.customer_email,
              subject: recoveryMessage.subject,
              tone: recoveryMessage.tone,
            },
          });

          updatePaymentStatus(payment.id, 'recovering');

          return {
            success: true,
            paymentId: payment.id,
            strategy: 'payment_link',
            message: `Payment link created and sent to ${payment.customer_email}`,
            details: {
              paymentLinkUrl: (paymentLink as Record<string, unknown>).short_url,
              message: recoveryMessage,
            },
            requiresApproval: false,
          };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          updateRecoveryAttempt(attempt.id, {
            status: 'failed',
            result: `Failed to create payment link: ${errorMsg}`,
          });

          insertAuditLog({
            failed_payment_id: payment.id,
            recovery_attempt_id: attempt.id,
            action: 'retry_failed',
            details: { error: errorMsg, strategy: 'payment_link' },
          });

          return {
            success: false,
            paymentId: payment.id,
            strategy: 'payment_link',
            message: `Failed to create payment link: ${errorMsg}`,
            details: { error: errorMsg },
            requiresApproval: false,
          };
        }
      }

      case 'notification': {
        updateRecoveryAttempt(attempt.id, { status: 'in_progress' });

        const recoveryMessage = await generateRecoveryMessage(payment, diagnosis);

        updateRecoveryAttempt(attempt.id, {
          status: 'success',
          result: `Notification generated for ${payment.customer_email}`,
        });

        insertAuditLog({
          failed_payment_id: payment.id,
          recovery_attempt_id: attempt.id,
          action: 'notification_sent',
          details: {
            channel: 'email',
            recipient: payment.customer_email,
            subject: recoveryMessage.subject,
            tone: recoveryMessage.tone,
            body: recoveryMessage.body,
          },
        });

        return {
          success: true,
          paymentId: payment.id,
          strategy: 'notification',
          message: `Recovery notification generated for customer`,
          details: { message: recoveryMessage },
          requiresApproval: false,
        };
      }

      case 'escalate':
      default: {
        updatePaymentStatus(payment.id, 'pending_approval');
        updateRecoveryAttempt(attempt.id, {
          status: 'success',
          result: 'Escalated for human review',
        });

        insertAuditLog({
          failed_payment_id: payment.id,
          recovery_attempt_id: attempt.id,
          action: 'human_gate_triggered',
          details: {
            reason: decision.reasoning,
            diagnosis: diagnosis.diagnosis,
            riskLevel: diagnosis.riskLevel,
          },
        });

        return {
          success: true,
          paymentId: payment.id,
          strategy: 'escalate',
          message: 'Payment escalated for human review',
          details: {
            diagnosis: diagnosis.diagnosis,
            reasoning: decision.reasoning,
          },
          requiresApproval: true,
        };
      }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    insertAuditLog({
      failed_payment_id: payment.id,
      recovery_attempt_id: attempt.id,
      action: 'agent_error',
      details: { error: errorMsg, strategy: decision.strategy },
    });

    updateRecoveryAttempt(attempt.id, {
      status: 'failed',
      result: `Agent error: ${errorMsg}`,
    });

    return {
      success: false,
      paymentId: payment.id,
      strategy: decision.strategy,
      message: `Recovery failed: ${errorMsg}`,
      details: { error: errorMsg },
      requiresApproval: false,
    };
  }
}
