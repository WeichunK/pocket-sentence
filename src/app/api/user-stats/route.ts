import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId') || 'user-1';

        // Get all distinct learning dates for the user, sorted descending
        const records = db.prepare(`
      SELECT DISTINCT date(date_learned, 'unixepoch', 'localtime') as learning_date
      FROM learning_records
      WHERE user_id = ?
      ORDER BY learning_date DESC
    `).all(userId) as { learning_date: string }[];

        let streak = 0;
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');

        if (records.length > 0) {
            // Check if the most recent learning date is today or yesterday
            const lastDate = records[0].learning_date;

            if (lastDate === today || lastDate === yesterday) {
                streak = 1;

                // Check consecutive days backwards
                for (let i = 0; i < records.length - 1; i++) {
                    const current = new Date(records[i].learning_date);
                    const next = new Date(records[i + 1].learning_date);

                    // Calculate difference in days
                    const diffTime = Math.abs(current.getTime() - next.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }

        // Get total learned count
        const totalLearned = db.prepare('SELECT COUNT(*) as count FROM learning_records WHERE user_id = ?').get(userId) as { count: number };

        return NextResponse.json({
            streak,
            totalLearned: totalLearned.count
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
