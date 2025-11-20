import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const sentences = db.prepare(`
      SELECT s.*, lr.date_learned, lr.proficiency_score
      FROM sentences s
      JOIN learning_records lr ON s.id = lr.sentence_id
      ORDER BY lr.date_learned DESC
    `).all();

        const formattedSentences = sentences.map((s: any) => ({
            ...s,
            vocabulary: JSON.parse(s.vocabulary || '[]')
        }));

        return NextResponse.json(formattedSentences);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
