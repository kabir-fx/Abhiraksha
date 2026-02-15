import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth config — used by middleware.
 *
 * CRITICAL: This file must NOT import or reference Prisma, bcryptjs,
 * lib/db, or any other Node.js-only module — not even via dynamic import().
 * Turbopack statically traces all imports (including dynamic ones) and will
 * include them in the Edge bundle.
 *
 * The Credentials provider with its `authorize` callback (which needs Prisma)
 * is added only in lib/auth.ts, which runs exclusively in Node.js runtime.
 *
 * The middleware only needs to verify JWT sessions — it never calls `authorize`.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
