import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  FailedPayment,
  RecoveryAttempt,
  AuditLog,
  AuditAction,
  PaymentStatus,
  RecoveryStatus,
  FailureCategory,
  RecoveryStrategy,
} from '../types';

const DB_PATH = path.join(process.cwd(), 'data', 'revenueguard.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS failed_payments (
      id TEXT PRIMARY KEY,
      razorpay_payment_id TEXT UNIQUE NOT NULL,
      razorpay_order_id TEXT,
      amount INTEGER NOT NULL,
      currency TEXT DEFAULT 'INR',
      customer_email TEXT,
      customer_phone TEXT,
      customer_name TEXT,
      error_code TEXT,
      error_description TEXT,
      error_reason TEXT,
      method TEXT,
      failure_category TEXT DEFAULT 'unknown',
      status TEXT DEFAULT 'failed',
      retry_count INTEGER DEFAULT 0,
      max_retries INTEGER DEFAULT 3,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS recovery_attempts (
      id TEXT PRIMARY KEY,
      failed_payment_id TEXT NOT NULL,
      strategy TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      attempt_number INTEGER NOT NULL,
      diagnosis TEXT,
      reasoning TEXT,
      action_details TEXT,
      result TEXT,
      payment_link_id TEXT,
      payment_link_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (failed_payment_id) REFERENCES failed_payments(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      failed_payment_id TEXT,
      recovery_attempt_id TEXT,
      action TEXT NOT NULL,
      details TEXT NOT NULL,
      ai_reasoning TEXT,
      confidence_score REAL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS agent_config (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      description TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_failed_payments_status ON failed_payments(status);
    CREATE INDEX IF NOT EXISTS idx_failed_payments_rpay_id ON failed_payments(razorpay_payment_id);
    CREATE INDEX IF NOT EXISTS idx_recovery_attempts_fp ON recovery_attempts(failed_payment_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_fp ON audit_logs(failed_payment_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
  `);

  // Insert default config if not exists
  const insertConfig = db.prepare(
    'INSERT OR IGNORE INTO agent_config (id, key, value, description) VALUES (?, ?, ?, ?)'
  );

  const defaults = [
    ['max_retry_attempts', '3', 'Maximum retry attempts per failed payment'],
    ['human_gate_threshold', '500000', 'Amount (paise) above which human approval is required'],
    ['daily_budget_cap', '10000000', 'Daily budget cap for recovery actions (paise)'],
    ['weekly_budget_cap', '50000000', 'Weekly budget cap for recovery actions (paise)'],
    ['monthly_budget_cap', '150000000', 'Monthly budget cap for recovery actions (paise)'],
    ['cooldown_period_ms', '3600000', 'Minimum time between retries (ms)'],
    ['auto_recovery_enabled', 'true', 'Whether automatic recovery is enabled'],
  ];

  const insertMany = db.transaction(() => {
    for (const [key, value, desc] of defaults) {
      insertConfig.run(uuidv4(), key, value, desc);
    }
  });
  insertMany();
}

// ============================================================
// Failed Payments CRUD
// ============================================================

export function insertFailedPayment(data: {
  razorpay_payment_id: string;
  razorpay_order_id?: string | null;
  amount: number;
  currency?: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_name?: string | null;
  error_code?: string | null;
  error_description?: string | null;
  error_reason?: string | null;
  method?: string | null;
  failure_category?: FailureCategory;
}): FailedPayment {
  const db = getDb();
  const id = uuidv4();

  // Check for duplicates
  const existing = db.prepare('SELECT * FROM failed_payments WHERE razorpay_payment_id = ?').get(data.razorpay_payment_id);
  if (existing) return existing as FailedPayment;

  const stmt = db.prepare(`
    INSERT INTO failed_payments (id, razorpay_payment_id, razorpay_order_id, amount, currency,
      customer_email, customer_phone, customer_name, error_code, error_description,
      error_reason, method, failure_category, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'failed')
  `);

  stmt.run(
    id,
    data.razorpay_payment_id,
    data.razorpay_order_id || null,
    data.amount,
    data.currency || 'INR',
    data.customer_email || null,
    data.customer_phone || null,
    data.customer_name || null,
    data.error_code || null,
    data.error_description || null,
    data.error_reason || null,
    data.method || null,
    data.failure_category || 'unknown'
  );

  return db.prepare('SELECT * FROM failed_payments WHERE id = ?').get(id) as FailedPayment;
}

export function updatePaymentStatus(id: string, status: PaymentStatus): void {
  const db = getDb();
  db.prepare("UPDATE failed_payments SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
}

export function updateFailureCategory(id: string, category: string): void {
  const db = getDb();
  db.prepare("UPDATE failed_payments SET failure_category = ?, updated_at = datetime('now') WHERE id = ?").run(category, id);
}

export function incrementRetryCount(id: string): void {
  const db = getDb();
  db.prepare("UPDATE failed_payments SET retry_count = retry_count + 1, updated_at = datetime('now') WHERE id = ?").run(id);
}

export function getFailedPayment(id: string): FailedPayment | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM failed_payments WHERE id = ?').get(id) as FailedPayment) || null;
}

export function getFailedPaymentByRazorpayId(rpayId: string): FailedPayment | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM failed_payments WHERE razorpay_payment_id = ?').get(rpayId) as FailedPayment) || null;
}

export function getAllFailedPayments(filters?: {
  status?: PaymentStatus;
  limit?: number;
  offset?: number;
}): FailedPayment[] {
  const db = getDb();
  let query = 'SELECT * FROM failed_payments';
  const params: (string | number)[] = [];

  if (filters?.status) {
    query += ' WHERE status = ?';
    params.push(filters.status);
  }

  query += ' ORDER BY created_at DESC';

  if (filters?.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  return db.prepare(query).all(...params) as FailedPayment[];
}

// ============================================================
// Recovery Attempts CRUD
// ============================================================

export function insertRecoveryAttempt(data: {
  failed_payment_id: string;
  strategy: RecoveryStrategy;
  attempt_number: number;
  diagnosis?: string | null;
  reasoning?: string | null;
  action_details?: string | null;
}): RecoveryAttempt {
  const db = getDb();
  const id = uuidv4();

  db.prepare(`
    INSERT INTO recovery_attempts (id, failed_payment_id, strategy, status, attempt_number,
      diagnosis, reasoning, action_details)
    VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)
  `).run(
    id,
    data.failed_payment_id,
    data.strategy,
    data.attempt_number,
    data.diagnosis || null,
    data.reasoning || null,
    data.action_details || null
  );

  return db.prepare('SELECT * FROM recovery_attempts WHERE id = ?').get(id) as RecoveryAttempt;
}

export function updateRecoveryAttempt(id: string, data: {
  status?: RecoveryStatus;
  result?: string;
  payment_link_id?: string;
  payment_link_url?: string;
}): void {
  const db = getDb();
  const updates: string[] = [];
  const params: (string | null)[] = [];

  if (data.status) { updates.push('status = ?'); params.push(data.status); }
  if (data.result) { updates.push('result = ?'); params.push(data.result); }
  if (data.payment_link_id) { updates.push('payment_link_id = ?'); params.push(data.payment_link_id); }
  if (data.payment_link_url) { updates.push('payment_link_url = ?'); params.push(data.payment_link_url); }

  if (data.status === 'success' || data.status === 'failed') {
    updates.push("completed_at = datetime('now')");
  }

  if (updates.length === 0) return;
  params.push(id);
  db.prepare(`UPDATE recovery_attempts SET ${updates.join(', ')} WHERE id = ?`).run(...params);
}

export function getRecoveryAttempts(failedPaymentId: string): RecoveryAttempt[] {
  const db = getDb();
  return db.prepare('SELECT * FROM recovery_attempts WHERE failed_payment_id = ? ORDER BY attempt_number ASC')
    .all(failedPaymentId) as RecoveryAttempt[];
}

export function getAllRecoveryAttempts(filters?: {
  status?: RecoveryStatus;
  limit?: number;
}): RecoveryAttempt[] {
  const db = getDb();
  let query = 'SELECT * FROM recovery_attempts';
  const params: (string | number)[] = [];

  if (filters?.status) {
    query += ' WHERE status = ?';
    params.push(filters.status);
  }

  query += ' ORDER BY created_at DESC';

  if (filters?.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
  }

  return db.prepare(query).all(...params) as RecoveryAttempt[];
}

// ============================================================
// Audit Logs
// ============================================================

export function insertAuditLog(data: {
  failed_payment_id?: string | null;
  recovery_attempt_id?: string | null;
  action: AuditAction;
  details: Record<string, unknown>;
  ai_reasoning?: string | null;
  confidence_score?: number | null;
}): AuditLog {
  const db = getDb();
  const id = uuidv4();

  db.prepare(`
    INSERT INTO audit_logs (id, failed_payment_id, recovery_attempt_id, action, details, ai_reasoning, confidence_score)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.failed_payment_id || null,
    data.recovery_attempt_id || null,
    data.action,
    JSON.stringify(data.details),
    data.ai_reasoning || null,
    data.confidence_score || null
  );

  return db.prepare('SELECT * FROM audit_logs WHERE id = ?').get(id) as AuditLog;
}

export function getAuditLogs(filters?: {
  failed_payment_id?: string;
  action?: AuditAction;
  limit?: number;
  offset?: number;
}): AuditLog[] {
  const db = getDb();
  let query = 'SELECT * FROM audit_logs';
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.failed_payment_id) {
    conditions.push('failed_payment_id = ?');
    params.push(filters.failed_payment_id);
  }
  if (filters?.action) {
    conditions.push('action = ?');
    params.push(filters.action);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  if (filters?.limit) {
    query += ' LIMIT ?';
    params.push(filters.limit);
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
  }

  return db.prepare(query).all(...params) as AuditLog[];
}

// ============================================================
// Agent Config
// ============================================================

export function getConfigValue(key: string): string | null {
  const db = getDb();
  const row = db.prepare('SELECT value FROM agent_config WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value || null;
}

export function setConfigValue(key: string, value: string): void {
  const db = getDb();
  db.prepare("UPDATE agent_config SET value = ?, updated_at = datetime('now') WHERE key = ?").run(value, key);
}

export function getAllConfig(): AgentConfig[] {
  const db = getDb();
  return db.prepare('SELECT * FROM agent_config ORDER BY key').all() as AgentConfig[];
}

// ============================================================
// Stats & Aggregates
// ============================================================

export function getDashboardStats(): {
  totalFailed: number;
  totalRecovered: number;
  totalRecoveryAmount: number;
  recoveryRate: number;
  pendingApprovals: number;
  activeRecoveries: number;
  budgetUsedToday: number;
  failuresByCategory: { category: string; count: number }[];
  recoveryByStrategy: { strategy: string; count: number; success: number }[];
  dailyRecovery: { date: string; recovered: number; failed: number }[];
} {
  const db = getDb();

  const totalFailed = (db.prepare('SELECT COUNT(*) as count FROM failed_payments').get() as { count: number }).count;
  const totalRecovered = (db.prepare("SELECT COUNT(*) as count FROM failed_payments WHERE status = 'recovered'").get() as { count: number }).count;
  const totalRecoveryAmount = (db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM failed_payments WHERE status = 'recovered'").get() as { total: number }).total;
  const pendingApprovals = (db.prepare("SELECT COUNT(*) as count FROM failed_payments WHERE status = 'pending_approval'").get() as { count: number }).count;
  const activeRecoveries = (db.prepare("SELECT COUNT(*) as count FROM failed_payments WHERE status = 'recovering'").get() as { count: number }).count;

  const budgetUsedToday = (db.prepare(`
    SELECT COALESCE(SUM(fp.amount), 0) as total
    FROM recovery_attempts ra
    JOIN failed_payments fp ON ra.failed_payment_id = fp.id
    WHERE ra.status = 'success' AND date(ra.completed_at) = date('now')
  `).get() as { total: number }).total;

  const failuresByCategory = db.prepare(`
    SELECT failure_category as category, COUNT(*) as count
    FROM failed_payments GROUP BY failure_category ORDER BY count DESC
  `).all() as { category: string; count: number }[];

  const recoveryByStrategy = db.prepare(`
    SELECT strategy, COUNT(*) as count,
      SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success
    FROM recovery_attempts GROUP BY strategy
  `).all() as { strategy: string; count: number; success: number }[];

  const dailyRecovery = db.prepare(`
    SELECT date(created_at) as date,
      SUM(CASE WHEN status = 'recovered' THEN 1 ELSE 0 END) as recovered,
      SUM(CASE WHEN status = 'failed' OR status = 'abandoned' THEN 1 ELSE 0 END) as failed
    FROM failed_payments
    WHERE created_at >= datetime('now', '-7 days')
    GROUP BY date(created_at) ORDER BY date ASC
  `).all() as { date: string; recovered: number; failed: number }[];

  return {
    totalFailed,
    totalRecovered,
    totalRecoveryAmount,
    recoveryRate: totalFailed > 0 ? (totalRecovered / totalFailed) * 100 : 0,
    pendingApprovals,
    activeRecoveries,
    budgetUsedToday,
    failuresByCategory,
    recoveryByStrategy,
    dailyRecovery,
  };
}
