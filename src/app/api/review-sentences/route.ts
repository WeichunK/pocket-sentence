import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const now = Math.floor(Date.now() / 1000);

        // Get retention setting
        const settingRow = db.prepare("SELECT value FROM settings WHERE key = 'retention_period_days'").get() as { value: string };
        const retentionDays = parseInt(settingRow?.value || '365');
        const retentionSeconds = retentionDays * 86400;
        const cutoffDate = now - retentionSeconds;

        // Fetch sentences that have a learning record with next_review_date <= now AND date_learned >= cutoffDate
        const sentences = db.prepare(`
      SELECT s.* 
      FROM sentences s
      JOIN learning_records lr ON s.id = lr.sentence_id
      WHERE lr.next_review_date <= ? AND lr.date_learned >= ?
    `).all(now, cutoffDate);

        const formattedSentences = sentences.map((s: any) => ({
            ...s,
            vocabulary: JSON.parse(s.vocabulary || '[]')
        }));

        return NextResponse.json(formattedSentences);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch review sentences' }, { status: 500 });
    }
}
