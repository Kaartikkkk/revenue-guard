import { NextResponse } from 'next/server';
import { getDashboardStats, getAllFailedPayments } from '@/lib/db/database';

export async function GET() {
  try {
    const stats = getDashboardStats();
    const recentFailures = getAllFailedPayments({ limit: 10 });

    return NextResponse.json({
      ...stats,
      recentFailures,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
