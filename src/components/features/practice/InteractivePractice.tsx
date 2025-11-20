'use client';

import { useState } from 'react';
import { Sentence } from '@/types';
import { motion } from 'framer-motion';
import { Send, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

interface InteractivePracticeProps {
    sentence: Sentence;
    onBack: () => void;
    onComplete: () => void;
    mode?: 'practice' | 'review';
    onRate?: (quality: number) => void;
    onSuccess?: () => void;
}

export default function InteractivePractice({ sentence, onBack, onComplete, mode = 'practice', onRate, onSuccess }: InteractivePracticeProps) {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
    const [attempts, setAttempts] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedInput = input.trim().toLowerCase().replace(/[.,!?]/g, '');
        const normalizedTarget = sentence.text.trim().toLowerCase().replace(/[.,!?]/g, '');

        if (normalizedInput === normalizedTarget) {
            setStatus('correct');
            if (mode === 'practice') {
                onSuccess?.();
            }
        } else {
            setStatus('incorrect');
            setAttempts(prev => prev + 1);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" /> {mode === 'review' ? 'Quit Review' : 'Back to study'}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col min-h-[500px]"
            >
                {/* Header / Context */}
                <div className="bg-blue-600 p-6 text-white">
                    <h3 className="text-lg font-bold mb-2 opacity-90">Roleplay Scenario</h3>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        {sentence.context_usage}
                    </p>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-6 bg-gray-50 flex flex-col gap-4 overflow-y-auto">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            AI
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-gray-800 max-w-[80%]">
                            <p>Imagine you are in this situation. How would you respond using the sentence you just learned?</p>
                        </div>
                    </div>

                    {status === 'correct' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex gap-3 justify-end"
                        >
                            <div className="bg-green-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                                <p>{sentence.text}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                You
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {status === 'correct' ? (
                        <div className="text-center py-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4"
                            >
                                <CheckCircle size={32} />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Excellent!</h3>
                            <p className="text-gray-500 mb-6">You used the sentence correctly in context.</p>

                            {mode === 'review' ? (
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => onRate?.(5)}
                                        className="px-6 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-colors"
                                    >
                                        Easy
                                    </button>
                                    <button
                                        onClick={() => onRate?.(4)}
                                        className="px-6 py-3 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                                    >
                                        Good
                                    </button>
                                    <button
                                        onClick={() => onRate?.(3)}
                                        className="px-6 py-3 bg-yellow-100 text-yellow-700 rounded-xl font-bold hover:bg-yellow-200 transition-colors"
                                    >
                                        Hard
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onComplete}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    Continue Practice
                                </button>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setStatus('idle');
                                }}
                                placeholder="Type your response here..."
                                className={clsx(
                                    "w-full p-4 pr-14 rounded-xl border-2 outline-none transition-all",
                                    status === 'incorrect'
                                        ? "border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500"
                                        : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                )}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="absolute right-2 top-2 bottom-2 w-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                            >
                                <Send size={20} />
                            </button>

                            {status === 'incorrect' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-full left-0 mb-2 text-red-500 text-sm font-medium flex items-center gap-1"
                                >
                                    <XCircle size={14} />
                                    Not quite. Try again!
                                    {attempts >= 3 && (
                                        <button
                                            type="button"
                                            onClick={() => setInput(sentence.text)}
                                            className="ml-2 underline text-blue-500 hover:text-blue-700"
                                        >
                                            Show Answer
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
