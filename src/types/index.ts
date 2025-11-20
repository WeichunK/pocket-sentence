export interface Vocabulary {
    word: string;
    meaning: string;
    part_of_speech: string;
}

export interface Sentence {
    id: string;
    text: string;
    translation: string;
    audio_url: string;
    vocabulary: Vocabulary[];
    grammar_explanation: string;
    context_usage: string;
    level: string;
}
