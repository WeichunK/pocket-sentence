'use client';

import { Sentence } from '@/types';
import { motion } from 'framer-motion';
import { Volume2, ArrowLeft, BookOpen, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface StudyCardProps {
    sentence: Sentence;
    onBack: () => void;
    onComplete: () => void;
}

export default function StudyCard({ sentence, onBack, onComplete }: StudyCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" /> Back to list
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
            >
                <div className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                        {sentence.text}
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">{sentence.translation}</p>

                    <button className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md text-blue-600 hover:scale-105 transition-transform">
                        <Volume2 size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex-1 py-3 px-4 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <BookOpen size={18} />
                            {showDetails ? 'Hide Explanations' : 'View Explanations'}
                        </button>
                        <button
                            onClick={onComplete}
                            className="flex-1 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-blue-200 shadow-lg"
                        >
                            <MessageCircle size={18} />
                            Start Practice
                        </button>
                    </div>

                    {showDetails && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="space-y-6"
                        >
                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Vocabulary</h4>
                                <div className="grid gap-3">
                                    {sentence.vocabulary.map((vocab, i) => (
                                        <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg">
                                            <span className="font-bold text-gray-800 mr-2">{vocab.word}</span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full mr-2">{vocab.part_of_speech}</span>
                                            <span className="text-gray-600">{vocab.meaning}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Grammar</h4>
                                <p className="text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                    {sentence.grammar_explanation}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Context</h4>
                                <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border border-green-100">
                                    {sentence.context_usage}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
