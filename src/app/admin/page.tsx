'use client';

import { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';

export default function AdminPage() {
    const [retentionDays, setRetentionDays] = useState(365);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                setRetentionDays(data.retentionDays);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ retentionDays }),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gray-100 rounded-xl">
                        <Settings className="text-gray-600" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            History Retention Limit (Days)
                        </label>
                        <p className="text-sm text-gray-500 mb-4">
                            Sentences learned older than this limit will not appear in review sessions.
                            (Simulates Free vs Paid tier limits)
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setRetentionDays(3)}
                                className={`px-4 py-2 rounded-lg border ${retentionDays === 3 ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                3 Days (Free Tier)
                            </button>
                            <button
                                onClick={() => setRetentionDays(365)}
                                className={`px-4 py-2 rounded-lg border ${retentionDays === 365 ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                1 Year (Paid Tier)
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <Save size={18} />
                        {saved ? 'Saved!' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
