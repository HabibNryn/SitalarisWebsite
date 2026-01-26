import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { isAdminFromRole } from "./auth-utils";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name ?? profile.email?.split("@")[0] ?? "User",
          image: profile.picture,
          role: UserRole.user,
          isActive: true,
          isAdmin: false,
          phone: null,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password || !user.isActive || !user.email) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          role: user.role,
          isActive: user.isActive,
          isAdmin: isAdminFromRole(user.role),
          phone: user.phone,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
        token.isAdmin = user.isAdmin;
        token.phone = user.phone;
      }

      if (token.isAdmin === undefined) {
        token.isAdmin = isAdminFromRole(token.role as UserRole);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
        session.user.isAdmin = token.isAdmin;
        session.user.phone = token.phone;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      if (!user.email) return;

      await prisma.user.update({
        where: { email: user.email },
        data: {
          role: UserRole.user,
          isActive: true,
        },
      });
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
