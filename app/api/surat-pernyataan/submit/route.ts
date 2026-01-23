// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs"; // WAJIB untuk Prisma + CredentialsProvider

// ==================== TYPE EXTENSIONS ====================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isActive: boolean;
      phone?: string | null;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    phone?: string | null;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phone?: string | null;
    isActive: boolean;
  }
}

// ==================== HELPER ====================
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Terjadi kesalahan yang tidak diketahui";
}

// ==================== AUTH OPTIONS ====================
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
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.email?.split("@")[0] || "User",
          email: profile.email,
          image: profile.picture,
          role: "USER",
          isActive: true,
          phone: null,
        };
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Email dan Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@sitalaris.com" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const email = credentials.email.toLowerCase().trim();

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              isActive: true,
              image: true,
              phone: true,
            },
          });

          if (!user) return null;
          if (!user.isActive) return null;
          if (!user.password) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            isActive: user.isActive,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", getErrorMessage(error));
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role.toUpperCase();
        token.phone = user.phone;
        token.isActive = user.isActive;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
        session.user.isActive = token.isActive as boolean;
        session.user.isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(token.role);
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.includes("/api/auth/callback")) return `${baseUrl}/`;
      if (url.includes("/register")) return `${baseUrl}/dashboard`;
      if (url.startsWith("http")) return url;
      return `${baseUrl}/dashboard`;
    },

    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({ where: { email: user.email } });

      // Jika user sudah ada, izinkan login
      if (existingUser) {
        // Jika login dengan Google baru, pastikan akun OAuth terhubung
        if (account?.provider === "google") {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              token_type: account.token_type,
              scope: account.scope,
            },
          });
        }
        return true;
      }

      // Jika user baru, biarkan NextAuth membuat user otomatis
      return true;
    },
  },

  events: {
    async createUser({ user }) {
      if (!user.email) return;
      await prisma.user.update({
        where: { email: user.email },
        data: { role: "user", isActive: true },
      });
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
  debug: process.env.NODE_ENV === "development",

  theme: {
    colorScheme: "light",
    brandColor: "#2563eb",
    logo: "/logo.png",
  },
};

// ==================== API HANDLER ====================
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };