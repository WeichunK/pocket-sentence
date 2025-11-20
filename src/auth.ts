import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import db from "@/lib/db"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
            },
            authorize: async (credentials) => {
                let user = null

                // Logic to verify if user exists
                const username = credentials.username as string
                if (!username) return null

                // Check if user exists in DB
                const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(username) as any

                if (!existingUser) {
                    // Auto-register user
                    try {
                        db.prepare("INSERT INTO users (id, level, subscription_type) VALUES (?, 'Beginner', 'Free')").run(username);
                        user = { id: username, name: username }
                    } catch (e) {
                        console.error("Failed to create user", e)
                        return null
                    }
                } else {
                    user = { id: existingUser.id, name: existingUser.id }
                }

                return user
            },
        }),
    ],
})
