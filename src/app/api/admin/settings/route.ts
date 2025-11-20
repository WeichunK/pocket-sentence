import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const row = db.prepare("SELECT value FROM settings WHERE key = 'retention_period_days'").get() as { value: string };
        return NextResponse.json({ retentionDays: parseInt(row?.value || '365') });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { retentionDays } = await req.json();

        const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('retention_period_days', ?)");
        stmt.run(String(retentionDays));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
