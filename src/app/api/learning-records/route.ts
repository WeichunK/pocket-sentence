import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sentenceId, userId = 'user-1' } = body; // Hardcoded user for MVP

        if (!sentenceId) {
            return NextResponse.json({ error: 'Missing sentenceId' }, { status: 400 });
        }

        // Simple SRS logic: Next review in 1 day
        const nextReviewDate = Math.floor(Date.now() / 1000) + 86400;

        const stmt = db.prepare(`
      INSERT INTO learning_records (id, user_id, sentence_id, next_review_date, proficiency_score)
      VALUES (?, ?, ?, ?, ?)
    `);

        stmt.run(uuidv4(), userId, sentenceId, nextReviewDate, 1);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
    }
}
