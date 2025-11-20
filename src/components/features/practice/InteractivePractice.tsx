'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, CheckCircle, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { Sentence } from '@/types';
import { useSpeech } from '@/lib/hooks/useSpeech';
import confetti from 'canvas-confetti';

interface InteractivePracticeProps {
    sentence: Sentence;
    onNext: () => void;
    onSuccess: () => void;
}

export default function InteractivePractice({ sentence, onNext, onSuccess }: InteractivePracticeProps) {
    const [userInput, setUserInput] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [shake, setShake] = useState(false);
    const { speak, speaking, supported: ttsSupported } = useSpeech();

    // Reset state when sentence changes
    useEffect(() => {
        setUserInput('');
        setShowHint(false);
        setFeedback('idle');
        setShake(false);
    }, [sentence]);

    const checkAnswer = useCallback(() => {
        const normalize = (text: string) => text.toLowerCase().replace(/[.,?!]/g, '').trim();
        // Use sentence.text instead of sentence.english
        const isCorrect = normalize(userInput) === normalize(sentence.text);

        if (isCorrect) {
            setFeedback('correct');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            speak(sentence.text); // Use sentence.text
            onSuccess();
        } else {
            setFeedback('incorrect');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    }, [userInput, sentence.text, onSuccess, speak]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (feedback === 'correct') {
                onNext();
            } else {
                checkAnswer();
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Context Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-blue-50"
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            Translate this
                        </span>
                        {ttsSupported && (
                            <button
                                onClick={() => speak(sentence.text)} // Use sentence.text
                                disabled={speaking}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                            >
                                <Volume2 size={20} className={speaking ? 'animate-pulse' : ''} />
                            </button>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                        {sentence.translation}
                    </h2>

                    {sentence.practice_scenario && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-600 text-sm italic">
                            <span className="font-semibold not-italic text-gray-900 block mb-1">Scenario:</span>
                            {sentence.practice_scenario}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Input Area */}
            <motion.div
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="space-y-4"
            >
                <div className="relative">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type the English sentence..."
                        className={`w-full p-6 text-xl rounded-2xl border-2 outline-none transition-all shadow-sm
              ${feedback === 'correct'
                                ? 'border-green-500 bg-green-50 text-green-900'
                                : feedback === 'incorrect'
                                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500'
                                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                            }`}
                        autoFocus
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        {feedback === 'correct' && <CheckCircle className="text-green-500 w-8 h-8" />}
                        {feedback === 'incorrect' && <AlertCircle className="text-red-500 w-8 h-8" />}
                    </div>
                </div>

                {/* Feedback & Controls */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        {showHint ? sentence.text : 'Need a hint?'}
                    </button>

                    <div className="flex gap-3">
                        {feedback !== 'correct' ? (
                            <button
                                onClick={checkAnswer}
                                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 transition-all active:scale-95"
                            >
                                Check Answer
                            </button>
                        ) : (
                            <button
                                onClick={onNext}
                                className="px-8 py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                            >
                                Continue <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
