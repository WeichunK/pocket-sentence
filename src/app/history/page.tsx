'use client';

import { useState, useEffect } from 'react';
import { Sentence } from '@/types';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HistoryItem extends Sentence {
    date_learned: number;
    proficiency_score: number;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/history')
            .then(res => res.json())
            .then(data => {
                setHistory(data);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center gap-4">
                    <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Learning History</h1>
                </header>

                <div className="grid gap-4">
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-center py-12">No sentences learned yet. Go practice!</p>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800 mb-1">{item.text}</p>
                                    <p className="text-sm text-gray-500">{item.translation}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                    <Calendar size={12} />
                                    {new Date(item.date_learned * 1000).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
