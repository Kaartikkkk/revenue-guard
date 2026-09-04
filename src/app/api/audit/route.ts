import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/db/database';
import { AuditAction } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const failedPaymentId = searchParams.get('payment_id') || undefined;
    const action = searchParams.get('action') as AuditAction | null;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const logs = getAuditLogs({
      failed_payment_id: failedPaymentId,
      action: action || undefined,
      limit,
      offset,
    });

    // Parse JSON details for each log
    const enriched = logs.map((log) => ({
      ...log,
      details: typeof log.details === 'string' ? JSON.parse(log.details) : log.details,
    }));

    return NextResponse.json({
      logs: enriched,
      total: enriched.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
