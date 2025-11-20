import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // const userId = session.user.id; // Can be used for filtering later

        // In a real app, this would select based on user level and date.
        // For MVP, we just pick 3 random sentences.
        const sentences = db.prepare('SELECT * FROM sentences ORDER BY RANDOM() LIMIT 5').all();

        // Parse JSON fields
        const formattedSentences = sentences.map((s: any) => ({
            ...s,
            vocabulary: JSON.parse(s.vocabulary || '[]')
        }));

        return NextResponse.json(formattedSentences);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch sentences' }, { status: 500 });
    }
}
