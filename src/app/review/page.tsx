'use client';

import { useState, useEffect } from 'react';
import { Sentence } from '@/types';
import InteractivePractice from '@/components/features/practice/InteractivePractice';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReviewPage() {
    const [sentences, setSentences] = useState<Sentence[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch('/api/review-sentences');
                const data = await res.json();
                setSentences(data);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, []);

    const handleNext = async () => {
        // Update review date in DB (Simple logic: push back 3 days)
        // In a real app, we'd call an API to update the specific record based on performance.
        // For MVP, we just move to the next card locally.

        if (currentIndex < sentences.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (sentences.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h2>
                <p className="text-gray-500 mb-8">You have no sentences to review right now.</p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Session Complete!</h2>
                <p className="text-gray-500 mb-8">You've reviewed {sentences.length} sentences today.</p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Review Session</h1>
                    <span className="text-sm font-medium text-gray-500">
                        {currentIndex + 1} / {sentences.length}
                    </span>
                </header>

                <InteractivePractice
                    sentence={sentences[currentIndex]}
                    onBack={() => { }} // Disable back in review mode? Or maybe go to home.
                    onComplete={handleNext}
                />
            </div>
        </div>
    );
}
