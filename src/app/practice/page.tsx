'use client';

import { useState, useEffect } from 'react';
import { Sentence } from '@/types';
import DailyList from '@/components/features/practice/DailyList';
import StudyCard from '@/components/features/practice/StudyCard';
import InteractivePractice from '@/components/features/practice/InteractivePractice';
import { Loader2 } from 'lucide-react';

export default function PracticePage() {
    const [sentences, setSentences] = useState<Sentence[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(null);
    const [mode, setMode] = useState<'list' | 'study' | 'interactive'>('list');

    useEffect(() => {
        async function fetchSentences() {
            try {
                const res = await fetch('/api/daily-sentences');
                const data = await res.json();
                setSentences(data);
            } catch (error) {
                console.error('Failed to fetch sentences', error);
            } finally {
                setLoading(false);
            }
        }
        fetchSentences();
    }, []);

    const handleSelect = (sentence: Sentence) => {
        setSelectedSentence(sentence);
        setMode('study');
    };

    const handleBack = () => {
        setMode('list');
        setSelectedSentence(null);
    };

    const handleStartPractice = () => {
        setMode('interactive');
    };

    const handleSuccess = async () => {
        if (selectedSentence) {
            try {
                await fetch('/api/learning-records', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sentenceId: selectedSentence.id,
                        userId: 'user-1'
                    }),
                });
            } catch (error) {
                console.error('Failed to save progress', error);
            }
        }
    };

    const handleComplete = () => {
        handleBack();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pocket Sentence</h1>
                    <p className="text-gray-500 mt-2">Master English, one sentence at a time.</p>
                </header>

                <main>
                    {mode === 'list' && (
                        <DailyList sentences={sentences} onSelect={handleSelect} />
                    )}

                    {mode === 'study' && selectedSentence && (
                        <StudyCard
                            sentence={selectedSentence}
                            onBack={handleBack}
                            onComplete={handleStartPractice}
                        />
                    )}

                    {mode === 'interactive' && selectedSentence && (
                        <InteractivePractice
                            sentence={selectedSentence}
                            onNext={handleComplete}
                            onSuccess={handleSuccess}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
