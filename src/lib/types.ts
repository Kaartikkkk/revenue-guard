// ============================================================
// Core Types for RevenueGuard AI
// ============================================================

export type PaymentStatus = 'failed' | 'recovering' | 'recovered' | 'abandoned' | 'pending_approval';
export type RecoveryStrategy = 'immediate_retry' | 'delayed_retry' | 'payment_link' | 'notification' | 'escalate';
export type RecoveryStatus = 'pending' | 'in_progress' | 'success' | 'failed' | 'skipped' | 'approved' | 'rejected';
export type FailureCategory = 'network_error' | 'insufficient_funds' | 'card_declined' | 'expired_card' | 'authentication_failed' | 'bank_error' | 'invalid_details' | 'unknown';
export type AuditAction = 'payment_failed_received' | 'diagnosis_complete' | 'strategy_selected' | 'retry_initiated' | 'retry_success' | 'retry_failed' | 'payment_link_created' | 'notification_sent' | 'human_gate_triggered' | 'human_approved' | 'human_rejected' | 'budget_cap_hit' | 'agent_error' | 'fallback_activated';

export interface FailedPayment {
  id: string;
  razorpay_payment_id: string;
  razorpay_order_id: string | null;
  amount: number; // in paise
  currency: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_name: string | null;
  error_code: string | null;
  error_description: string | null;
  error_reason: string | null;
  method: string | null;
  failure_category: FailureCategory;
  status: PaymentStatus;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

export interface RecoveryAttempt {
  id: string;
  failed_payment_id: string;
  strategy: RecoveryStrategy;
  status: RecoveryStatus;
  attempt_number: number;
  diagnosis: string | null;
  reasoning: string | null;
  action_details: string | null; // JSON string
  result: string | null;
  payment_link_id: string | null;
  payment_link_url: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface AuditLog {
  id: string;
  failed_payment_id: string | null;
  recovery_attempt_id: string | null;
  action: AuditAction;
  details: string; // JSON string
  ai_reasoning: string | null;
  confidence_score: number | null;
  created_at: string;
}

export interface AgentConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export interface DashboardStats {
  totalFailedPayments: number;
  totalRecovered: number;
  totalRecoveryAmount: number;
  recoveryRate: number;
  pendingApprovals: number;
  activeRecoveries: number;
  budgetUsedToday: number;
  budgetCapToday: number;
  recentFailures: FailedPayment[];
  recoveryByStrategy: { strategy: string; count: number; success: number }[];
  failuresByCategory: { category: string; count: number }[];
  dailyRecovery: { date: string; recovered: number; failed: number }[];
}

export interface DiagnosisResult {
  category: FailureCategory;
  diagnosis: string;
  confidence: number;
  isRetryable: boolean;
  recommendedStrategy: RecoveryStrategy;
  reasoning: string;
  suggestedDelay: number; // ms
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RecoveryMessage {
  subject: string;
  body: string;
  tone: 'friendly' | 'urgent' | 'formal';
  paymentLinkText: string;
}

export interface SimulationScenario {
  name: string;
  description: string;
  failureType: FailureCategory;
  amount: number;
  method: string;
  errorCode: string;
  errorDescription: string;
}

export interface AgentConfig {
  key: string;
  value: string;
  updated_at: string;
}

export interface WebhookEvent {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: RazorpayPaymentEntity;
    };
  };
  created_at: number;
}

export interface RazorpayPaymentEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string | null;
  method: string;
  description: string | null;
  email: string | null;
  contact: string | null;
  error_code: string | null;
  error_description: string | null;
  error_reason: string | null;
  notes: Record<string, string>;
  created_at: number;
}
