import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateSentence } from '@/lib/ai-service';
import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const { level = 'Beginner', category } = body;

        // Validate level
        if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
            return NextResponse.json(
                { error: 'Invalid level. Must be Beginner, Intermediate, or Advanced' },
                { status: 400 }
            );
        }

        console.log(`Generating ${level} sentence${category ? ` in category ${category}` : ''}...`);

        // Generate sentence using Gemini AI
        const generated = await generateSentence({ level, category });

        // Save to database
        const sentenceId = uuidv4();
        const insertStmt = db.prepare(`
      INSERT INTO sentences (
        id, text, translation, audio_url, vocabulary, 
        grammar_explanation, context_usage, level, 
        practice_scenario, source, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        insertStmt.run(
            sentenceId,
            generated.text,
            generated.translation,
            '', // audio_url - can be generated later if needed
            JSON.stringify(generated.vocabulary),
            generated.grammar_explanation,
            generated.context_usage,
            generated.level,
            generated.practice_scenario,
            'ai-generated',
            Math.floor(Date.now() / 1000)
        );

        console.log(`✓ Generated and saved sentence: ${generated.text.substring(0, 50)}...`);

        // Return the complete sentence object
        const sentence = {
            id: sentenceId,
            ...generated,
            audio_url: '',
            source: 'ai-generated',
        };

        return NextResponse.json(sentence);
    } catch (error) {
        console.error('Failed to generate sentence:', error);

        // Return appropriate error message
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = errorMessage.includes('API key') ? 500 : 500;

        return NextResponse.json(
            {
                error: 'Failed to generate sentence',
                details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: statusCode }
        );
    }
}
