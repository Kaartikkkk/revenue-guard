import { NextRequest, NextResponse } from 'next/server';
import { getAllConfig, setConfigValue } from '@/lib/db/database';

export async function GET() {
  try {
    const configs = getAllConfig();
    return NextResponse.json({ configs });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body as { settings: { key: string; value: string }[] };

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Invalid request body. Expected { settings: [{ key, value }] }' },
        { status: 400 }
      );
    }

    for (const { key, value } of settings) {
      setConfigValue(key, value);
    }

    const updated = getAllConfig();
    return NextResponse.json({
      message: 'Settings updated successfully',
      configs: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
