'use client';

import { Sentence } from '@/types';
import { motion } from 'framer-motion';
import { Play, ChevronRight } from 'lucide-react';

interface DailyListProps {
    sentences: Sentence[];
    onSelect: (sentence: Sentence) => void;
}

export default function DailyList({ sentences, onSelect }: DailyListProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Practice</h2>
            <div className="grid gap-4">
                {sentences.map((sentence, index) => (
                    <motion.div
                        key={sentence.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelect(sentence)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group"
                    >
                        <div className="flex-1">
                            <p className="text-lg font-medium text-gray-800 mb-1">{sentence.text}</p>
                            <p className="text-sm text-gray-500">{sentence.translation}</p>
                        </div>
                        <div className="ml-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                            <ChevronRight size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
