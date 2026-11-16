import 'server-only';
import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  providers: [GitHubProvider({ clientId: process.env.GITHUB_CLIENT_ID ?? '', clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '' })],
  callbacks: {
    async signIn({ account }) { return account?.provider === 'github'; },
    async jwt({ token, account }) {
      if (account?.provider === 'github') token.sub = `github:${account.providerAccountId}`;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub ?? '';
      return session;
    },
  },
  logger: { error() { console.error('Authentication failed'); }, warn() {}, debug() {} },
};
