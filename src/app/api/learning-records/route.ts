import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { calculateSM2 } from '@/lib/srs';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        const body = await request.json();
        const { sentenceId, quality = 4 } = body;

        // Check if record exists
        const existingRecord = db.prepare('SELECT * FROM learning_records WHERE user_id = ? AND sentence_id = ?').get(userId, sentenceId) as any;

        let ef = 2.5;
        let reps = 0;
        let interval = 0;
        let prevInterval = 0;

        if (existingRecord) {
            ef = existingRecord.easiness_factor || 2.5;
            reps = existingRecord.repetitions || 0;
            prevInterval = existingRecord.interval_days || 0;
        }

        const result = calculateSM2(quality, ef, reps, prevInterval);

        const now = Math.floor(Date.now() / 1000);
        const nextReviewDate = now + (result.interval * 86400);

        if (existingRecord) {
            db.prepare(`
        UPDATE learning_records 
        SET date_learned = ?, next_review_date = ?, proficiency_score = ?, 
            easiness_factor = ?, interval_days = ?, repetitions = ?
        WHERE id = ?
      `).run(
                now,
                nextReviewDate,
                quality >= 3 ? 1 : 0, // Simple proficiency tracking
                result.easinessFactor,
                result.interval,
                result.repetitions,
                existingRecord.id
            );
        } else {
            db.prepare(`
        INSERT INTO learning_records (id, user_id, sentence_id, date_learned, next_review_date, proficiency_score, easiness_factor, interval_days, repetitions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
                uuidv4(),
                userId,
                sentenceId,
                now,
                nextReviewDate,
                quality >= 3 ? 1 : 0,
                result.easinessFactor,
                result.interval,
                result.repetitions
            );
        }

        return NextResponse.json({ success: true, nextReviewInDays: result.interval });
    } catch (error) {
        console.error('Error saving learning record:', error);
        return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
    }
}
