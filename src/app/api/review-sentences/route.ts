import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        // Fetch settings
        const retentionSetting = db.prepare("SELECT value FROM settings WHERE key = 'retention_period_days'").get() as { value: string };
        const retentionDays = parseInt(retentionSetting?.value || '365');

        const now = Math.floor(Date.now() / 1000);

        // Get sentences due for review
        // Logic:
        // 1. Must have a learning record for this user
        // 2. next_review_date <= now
        // 3. Within retention period
        const reviews = db.prepare(`
      SELECT s.*, lr.easiness_factor, lr.repetitions, lr.interval_days
      FROM sentences s
      JOIN learning_records lr ON s.id = lr.sentence_id
      WHERE lr.user_id = ?
    AND lr.next_review_date <= ?
        AND lr.date_learned >= ?
            `).all(userId, now, now - (retentionDays * 86400));

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Failed to fetch reviews', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
