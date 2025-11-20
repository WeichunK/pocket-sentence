import Link from 'next/link';
import { ArrowRight, BookOpen, History, RefreshCw } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Pocket Sentence</h1>
          <p className="text-xl text-gray-500">Your daily dose of English mastery.</p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/practice"
            className="group relative flex items-center justify-between p-6 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">Start Daily Practice</h3>
                <p className="text-blue-100 text-sm">3 sentences waiting for you</p>
              </div>
            </div>
            <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />

            {/* Decorative circle */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Link>

          <Link href="/review" className="flex items-center justify-between p-6 bg-green-50 text-green-900 rounded-2xl hover:bg-green-100 transition-colors border border-green-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-green-500">
                <RefreshCw size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">Review Session</h3>
                <p className="text-green-700 text-sm">Practice learned words</p>
              </div>
            </div>
          </Link>

          <Link href="/history" className="flex items-center justify-between p-6 bg-gray-50 text-gray-900 rounded-2xl hover:bg-gray-100 transition-colors border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-gray-500">
                <History size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">Learning Log</h3>
                <p className="text-gray-500 text-sm">View all sentences</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
