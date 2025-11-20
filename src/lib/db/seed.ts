import db, { initDB } from './index';
import { v4 as uuidv4 } from 'uuid';

const MOCK_SENTENCES = [
    {
        text: "Could you please double-check the figures in this report?",
        translation: "能否請您再次確認這份報告中的數據？",
        audio_url: "/audio/sentence-1.mp3", // Placeholder
        vocabulary: JSON.stringify([
            { word: "double-check", meaning: "再次確認", part_of_speech: "verb" },
            { word: "figures", meaning: "數據/數字", part_of_speech: "noun" }
        ]),
        grammar_explanation: "Use 'Could you please' for polite requests. 'Double-check' implies a careful review.",
        context_usage: "Used in a professional setting when asking a colleague or manager to review work.",
        level: "Intermediate"
    },
    {
        text: "I'm afraid I won't be able to make it to the meeting tomorrow.",
        translation: "恐怕我明天無法參加會議。",
        audio_url: "/audio/sentence-2.mp3",
        vocabulary: JSON.stringify([
            { word: "make it", meaning: "趕上/參加", part_of_speech: "phrase" },
            { word: "afraid", meaning: "抱歉/恐怕 (polite refusal)", part_of_speech: "adjective" }
        ]),
        grammar_explanation: "'I'm afraid' is a polite way to introduce bad news or a refusal.",
        context_usage: "Used when declining an invitation or informing about absence.",
        level: "Intermediate"
    },
    {
        text: "What do you think about this new design proposal?",
        translation: "你覺得這個新的設計提案怎麼樣？",
        audio_url: "/audio/sentence-3.mp3",
        vocabulary: JSON.stringify([
            { word: "proposal", meaning: "提案", part_of_speech: "noun" }
        ]),
        grammar_explanation: "'What do you think about...' is a standard way to ask for an opinion.",
        context_usage: "Used in meetings or casual work discussions to solicit feedback.",
        level: "Beginner"
    }
];

function seed() {
    console.log('Initializing DB...');
    initDB();

    console.log('Seeding sentences...');
    const insertStmt = db.prepare(`
    INSERT INTO sentences (id, text, translation, audio_url, vocabulary, grammar_explanation, context_usage, level)
    VALUES (@id, @text, @translation, @audio_url, @vocabulary, @grammar_explanation, @context_usage, @level)
  `);

    for (const s of MOCK_SENTENCES) {
        try {
            insertStmt.run({ ...s, id: uuidv4() });
        } catch (e) {
            console.log(`Skipping duplicate or error: ${s.text}`);
        }
    }

    console.log('Seeding complete!');
}

seed();
