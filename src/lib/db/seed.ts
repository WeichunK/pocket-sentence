import db, { initDB } from './index';
import { v4 as uuidv4 } from 'uuid';

const MOCK_SENTENCES = [
    // Business - Meetings
    {
        text: "Could you please double-check the figures in this report?",
        translation: "能否請您再次確認這份報告中的數據？",
        audio_url: "/audio/sentence-1.mp3",
        vocabulary: JSON.stringify([
            { word: "double-check", meaning: "再次確認", part_of_speech: "verb" },
            { word: "figures", meaning: "數據/數字", part_of_speech: "noun" }
        ]),
        grammar_explanation: "Use 'Could you please' for polite requests. 'Double-check' implies a careful review.",
        context_usage: "Used in a professional setting when asking a colleague or manager to review work.",
        level: "Intermediate",
        practice_scenario: "You noticed a potential error in the quarterly financial report. Ask your colleague, Sarah, to verify the numbers before the meeting."
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
        level: "Intermediate",
        practice_scenario: "You have a dentist appointment that conflicts with the weekly team sync. Inform your manager that you cannot attend."
    },
    {
        text: "Let's wrap up this meeting and follow up via email.",
        translation: "我們結束這次會議，後續透過電子郵件跟進。",
        audio_url: "/audio/sentence-4.mp3",
        vocabulary: JSON.stringify([
            { word: "wrap up", meaning: "結束/收尾", part_of_speech: "phrasal verb" },
            { word: "follow up", meaning: "跟進", part_of_speech: "phrasal verb" }
        ]),
        grammar_explanation: "'Let's' (Let us) is used to make suggestions. 'Via' means 'by way of' or 'through'.",
        context_usage: "Used to conclude a meeting efficiently.",
        level: "Intermediate",
        practice_scenario: "The meeting has run over time and you need to leave. Suggest ending the discussion now and continuing later."
    },
    // Business - Emails
    {
        text: "I'm writing to inquire about the status of my order.",
        translation: "我寫信是想詢問我的訂單狀態。",
        audio_url: "/audio/sentence-5.mp3",
        vocabulary: JSON.stringify([
            { word: "inquire", meaning: "詢問", part_of_speech: "verb" },
            { word: "status", meaning: "狀態/進度", part_of_speech: "noun" }
        ]),
        grammar_explanation: "'I'm writing to...' is a standard formal opening for emails.",
        context_usage: "Used in customer service or business correspondence.",
        level: "Beginner",
        practice_scenario: "You ordered a laptop two weeks ago but haven't received a shipping notification. Write an email to customer support."
    },
    // Daily Life - Travel
    {
        text: "Excuse me, could you tell me how to get to the train station?",
        translation: "不好意思，請問去火車站怎麼走？",
        audio_url: "/audio/sentence-6.mp3",
        vocabulary: JSON.stringify([
            { word: "get to", meaning: "抵達/去", part_of_speech: "phrase" }
        ]),
        grammar_explanation: "Indirect questions ('could you tell me how to...') are more polite than direct ones ('how do I get to...').",
        context_usage: "Used when asking for directions from a stranger.",
        level: "Beginner",
        practice_scenario: "You are lost in Tokyo and need to find the nearest JR station. Ask a passerby for help."
    },
    {
        text: "I'd like to check in, please. I have a reservation under the name of Smith.",
        translation: "我想辦理入住。我用 Smith 這個名字預訂了房間。",
        audio_url: "/audio/sentence-7.mp3",
        vocabulary: JSON.stringify([
            { word: "check in", meaning: "辦理入住", part_of_speech: "phrasal verb" },
            { word: "reservation", meaning: "預訂", part_of_speech: "noun" }
        ]),
        grammar_explanation: "'I'd like to' is a polite form of 'I want to'. 'Under the name of' specifies the booking details.",
        context_usage: "Used at a hotel reception.",
        level: "Intermediate",
        practice_scenario: "You have just arrived at the Hilton Hotel. Approach the front desk to get your room key."
    },
    // Daily Life - Shopping
    {
        text: "Do you have this in a smaller size?",
        translation: "請問這件有小一點的尺寸嗎？",
        audio_url: "/audio/sentence-8.mp3",
        vocabulary: JSON.stringify([
            { word: "size", meaning: "尺寸", part_of_speech: "noun" }
        ]),
        grammar_explanation: "Simple present question form.",
        context_usage: "Used in a clothing store.",
        level: "Beginner",
        practice_scenario: "You are trying on a jacket but it's too loose. Ask the shop assistant for a size S."
    },
    // Social - Small Talk
    {
        text: "It's been ages! How have you been?",
        translation: "好久不見！你最近好嗎？",
        audio_url: "/audio/sentence-9.mp3",
        vocabulary: JSON.stringify([
            { word: "ages", meaning: "很久 (informal)", part_of_speech: "noun" }
        ]),
        grammar_explanation: "'It's been ages' is a common idiom for 'long time no see'. Present perfect 'How have you been' asks about the period since you last met.",
        context_usage: "Used when meeting an old friend.",
        level: "Intermediate",
        practice_scenario: "You bump into your high school classmate at a coffee shop. Greet them warmly."
    },
    {
        text: "What do you do for fun on the weekends?",
        translation: "你週末通常都做些什麼休閒活動？",
        audio_url: "/audio/sentence-10.mp3",
        vocabulary: JSON.stringify([
            { word: "for fun", meaning: "為了好玩/休閒", part_of_speech: "phrase" }
        ]),
        grammar_explanation: "A casual way to ask about hobbies.",
        context_usage: "Used in casual conversation to get to know someone.",
        level: "Beginner",
        practice_scenario: "You are chatting with a new neighbor. Try to find common interests."
    },
    {
        text: "I'm really into photography lately.",
        translation: "我最近很迷攝影。",
        audio_url: "/audio/sentence-11.mp3",
        vocabulary: JSON.stringify([
            { word: "into", meaning: "著迷/喜歡 (informal)", part_of_speech: "preposition" },
            { word: "lately", meaning: "最近", part_of_speech: "adverb" }
        ]),
        grammar_explanation: "'To be into something' means to be interested in it.",
        context_usage: "Used to describe hobbies or interests.",
        level: "Beginner",
        practice_scenario: "Someone asked you about your hobbies. Share your current passion."
    }
];

function seed() {
    console.log('Initializing DB...');
    initDB();

    console.log('Seeding default user...');
    db.prepare("INSERT OR IGNORE INTO users (id, level, subscription_type) VALUES (?, 'Beginner', 'Free')").run('user-1');

    console.log('Seeding sentences...');
    const insertStmt = db.prepare(`
    INSERT INTO sentences (id, text, translation, audio_url, vocabulary, grammar_explanation, context_usage, level, practice_scenario)
    VALUES (@id, @text, @translation, @audio_url, @vocabulary, @grammar_explanation, @context_usage, @level, @practice_scenario)
  `);

    for (const s of MOCK_SENTENCES) {
        try {
            // Check if sentence text already exists to avoid duplicates during re-seed
            const exists = db.prepare('SELECT id FROM sentences WHERE text = ?').get(s.text);
            if (!exists) {
                insertStmt.run({ ...s, id: uuidv4() });
                console.log(`Inserted: ${s.text.substring(0, 20)}...`);
            } else {
                // Optional: Update existing records if we want to apply changes to scenarios
                // For now, we skip.
                console.log(`Skipping duplicate: ${s.text.substring(0, 20)}...`);
            }
        } catch (e) {
            console.log(`Error inserting ${s.text}:`, e);
        }
    }

    console.log('Seeding complete!');
}

seed();
