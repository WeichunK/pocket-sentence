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

        // Get a mix of seed and AI-generated sentences
        // Prioritize variety: include both types if available
        const allSentences = db.prepare(`
            SELECT * FROM sentences 
            ORDER BY 
                CASE 
                    WHEN source = 'ai-generated' THEN 1 
                    ELSE 2 
                END,
                RANDOM() 
            LIMIT 5
        `).all();

        // Parse JSON fields
        const formattedSentences = allSentences.map((s: any) => ({
            ...s,
            vocabulary: JSON.parse(s.vocabulary || '[]')
        }));

        return NextResponse.json(formattedSentences);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch sentences' }, { status: 500 });
    }
}
