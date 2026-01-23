import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

/* ======================================================
   TYPE AUGMENTATION
====================================================== */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isActive: boolean;
      isAdmin: boolean;
      phone?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    isActive: boolean;
    isAdmin: boolean;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isActive: boolean;
    isAdmin: boolean;
    phone?: string | null;
  }
}

/* ======================================================
   AUTH OPTIONS
====================================================== */
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
    /* ================= GOOGLE OAUTH ================= */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),

    /* ================= CREDENTIALS ================= */
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;
        if (!user.isActive) return null;
        if (!user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        const role = user.role?.toUpperCase() || "USER";
        const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(role);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role,
          isActive: user.isActive,
          phone: user.phone,
          image: user.image,
          isAdmin,
        };
      },
    }),
  ],

  /* ======================================================
     CALLBACKS
  ====================================================== */
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const role = user.role?.toUpperCase() || "USER";
        token.id = user.id;
        token.role = role;
        token.isActive = user.isActive ?? true;
        token.phone = user.phone ?? null;
        token.isAdmin =
          typeof user.isAdmin === "boolean"
            ? user.isAdmin
            : ["ADMIN", "SUPER_ADMIN"].includes(role);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
        session.user.phone = token.phone ?? null;
        session.user.isAdmin = token.isAdmin;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  /* ======================================================
     EVENTS
  ====================================================== */
  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "user",
          isActive: true,
        },
      });
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",

  theme: {
    colorScheme: "light",
    brandColor: "#2563eb",
    logo: "/logo.png",
  },
};

/* ======================================================
   HANDLER
====================================================== */
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
