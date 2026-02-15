import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";
import { authConfig } from "./auth.config";

/**
 * Full NextAuth instance with Credentials provider.
 * This file runs ONLY in Node.js runtime (API routes, server components).
 * It is NEVER imported by middleware.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isPasswordValid = await compare(
          credentials.password as string,
          user.hashedPassword,
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
});
