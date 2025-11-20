'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, History, RefreshCw, Flame, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';

export default function Home() {
  const [stats, setStats] = useState<{ streak: number; totalLearned: number } | null>(null);

  useEffect(() => {
    fetch('/api/user-stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Pocket Sentence</h1>
        <p className="text-xl text-gray-600">Master English sentences with daily practice.</p>

        {/* Stats Summary */}
        <div className="flex justify-center gap-8 pt-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <Flame size={24} />
              <span className="text-2xl font-bold">{stats?.streak || 0}</span>
            </div>
            <span className="text-sm text-gray-500">Day Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <BookOpen size={24} />
              <span className="text-2xl font-bold">{stats?.totalLearned || 0}</span>
            </div>
            <span className="text-sm text-gray-500">Sentences Learned</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/practice" className="group block p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <BookOpen size={24} />
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Practice</h2>
          <p className="text-gray-600">Learn 3 new sentences today with detailed explanations.</p>
        </Link>

        <Link href="/review" className="group block p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <RefreshCw size={24} />
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Session</h2>
          <p className="text-gray-600">Reinforce your memory with spaced repetition.</p>
        </Link>
      </div>

      <div className="flex justify-center gap-4">
        <Link href="/history" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors">
          <History size={16} className="mr-2" />
          View History
        </Link>
      </div>
    </div>
  );
}
