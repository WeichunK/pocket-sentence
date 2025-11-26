import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_KEY = process.env.GEMINI_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro';

if (!GEMINI_KEY) {
    throw new Error('GEMINI_KEY environment variable is not set');
}

const genAI = new GoogleGenerativeAI(GEMINI_KEY);

export interface GenerateSentenceOptions {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    category?: 'Business' | 'Travel' | 'Shopping' | 'Social' | 'General';
}

export interface GeneratedSentence {
    text: string;
    translation: string;
    vocabulary: Array<{
        word: string;
        meaning: string;
        part_of_speech: string;
    }>;
    grammar_explanation: string;
    context_usage: string;
    practice_scenario: string;
    level: string;
}

/**
 * Generate a practice sentence using Gemini AI
 */
export async function generateSentence(
    options: GenerateSentenceOptions
): Promise<GeneratedSentence> {
    const { level, category = 'General' } = options;

    const prompt = `You are an English learning assistant. Generate ONE practical English sentence for ${level} level learners.

Category: ${category}
Level: ${level}

Requirements:
- The sentence should be authentic and commonly used in real-life situations
- Appropriate difficulty for ${level} learners
- Include 2-4 useful vocabulary words
- Provide accurate Traditional Chinese translation (繁體中文)
- Include a realistic practice scenario

Return a JSON object with this EXACT structure:
{
  "text": "The complete English sentence",
  "translation": "完整的繁體中文翻譯",
  "vocabulary": [
    {
      "word": "key word or phrase from the sentence",
      "meaning": "中文意思",
      "part_of_speech": "noun/verb/adjective/adverb/phrase/phrasal verb"
    }
  ],
  "grammar_explanation": "Brief explanation of key grammar points in Traditional Chinese",
  "context_usage": "When and where this sentence is used, in Traditional Chinese",
  "practice_scenario": "A specific, realistic scenario where the learner would use this sentence. Make it vivid and practical. In Traditional Chinese."
}

Level Guidelines:
- Beginner: Simple present/past tense, basic vocabulary (A1-A2)
- Intermediate: Mixed tenses, common idioms, professional contexts (B1-B2)
- Advanced: Complex structures, nuanced expressions, sophisticated vocabulary (C1-C2)

Generate the sentence now:`;

    try {
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                maxOutputTokens: 8192, // Maximum for gemini-pro to handle complex Advanced content
                responseMimeType: "application/json", // Force JSON response
            }
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Full Gemini response length:', text.length);
        console.log('Full response:', text);

        // Extract JSON from the response (handle markdown code blocks)
        let jsonText = text.trim();

        // Try to extract JSON from markdown code blocks
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
            jsonText = codeBlockMatch[1].trim();
        } else if (text.startsWith('```')) {
            // Handle case where code block markers exist but regex didn't match
            jsonText = text.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
        }

        console.log('Extracted JSON text length:', jsonText.length);

        const generated = JSON.parse(jsonText) as GeneratedSentence;

        // Validate the structure
        if (!generated.text || !generated.translation || !generated.vocabulary) {
            throw new Error('Invalid response structure from Gemini');
        }

        // Add level to response
        generated.level = level;

        console.log('✅ Successfully generated sentence:', generated.text);

        return generated;
    } catch (error) {
        console.error('Failed to generate sentence:', error);
        if (error instanceof SyntaxError) {
            console.error('JSON parsing failed. Error:', error.message);
        }
        throw new Error(`Failed to generate sentence: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Generate multiple sentences in batch
 */
export async function generateSentenceBatch(
    count: number,
    options: GenerateSentenceOptions
): Promise<GeneratedSentence[]> {
    const promises = Array(count)
        .fill(null)
        .map(() => generateSentence(options));

    return Promise.all(promises);
}
