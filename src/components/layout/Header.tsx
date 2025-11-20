'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/60 backdrop-blur-xl transition-all">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                        P
                    </div>
                    <span className="font-bold text-xl text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        Pocket Sentence
                    </span>
                </Link>

                {session?.user && (
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-full">
                            <User size={16} />
                            <span>{session.user.name || session.user.id}</span>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
