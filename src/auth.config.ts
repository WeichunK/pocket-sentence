import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname === '/';
            const isOnAuth = nextUrl.pathname.startsWith('/login');
            const isOnApi = nextUrl.pathname.startsWith('/api');
            const isPublicApi = nextUrl.pathname.startsWith('/api/auth');

            if (isOnApi && !isPublicApi) {
                if (!isLoggedIn) {
                    return false;
                }
                return true;
            }

            if (isOnAuth) {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/', nextUrl));
                }
                return true;
            }

            if (!isLoggedIn && !isOnAuth) {
                return false;
            }

            return true;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
