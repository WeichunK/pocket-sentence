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

        const history = db.prepare(`
      SELECT s.text, s.translation, lr.date_learned, lr.next_review_date, lr.proficiency_score
      FROM learning_records lr
      JOIN sentences s ON lr.sentence_id = s.id
      WHERE lr.user_id = ?
      ORDER BY lr.date_learned DESC
    `).all(userId);

        return NextResponse.json(history);
    } catch (error) {
        console.error('Failed to fetch history', error);
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
