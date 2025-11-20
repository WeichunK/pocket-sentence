'use client';

import { useState, useEffect, useCallback } from 'react';

export function useSpeech() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setSupported(true);

            const updateVoices = () => {
                setVoices(window.speechSynthesis.getVoices());
            };

            updateVoices();
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!supported) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a good English voice
        const englishVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google'))
            || voices.find(v => v.lang.includes('en-US'))
            || voices.find(v => v.lang.includes('en'));

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        utterance.rate = 0.9; // Slightly slower for learning
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported, voices]);

    return { speak, speaking, supported };
}
