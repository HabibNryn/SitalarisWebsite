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
    isActive?: boolean;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phone?: string | null;
    isActive?: boolean;
    isAdmin?: boolean;
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
          isAdmin: false, // Tambahkan isAdmin untuk Google users
        };
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Email dan Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@sitalaris.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "••••••••",
        },
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

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (!isValid) return null;

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });

          // PERBAIKAN: Tambahkan isAdmin di sini berdasarkan role
          const role = user.role?.toUpperCase() || "USER";
          const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(role);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            isActive: user.isActive,
            image: user.image,
            isAdmin: isAdmin,
          };
        } catch (error) {
          console.error("Auth error:", getErrorMessage(error));
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role?.toUpperCase() || "USER";
        token.phone = user.phone;
        token.isActive = user.isActive;

        // PERBAIKAN: Set isAdmin dari user jika ada, atau hitung dari role
        if (typeof user.isAdmin === "boolean") {
          token.isAdmin = user.isAdmin;
        } else {
          // Hitung dari role jika isAdmin tidak ada di user
          const role = user.role?.toUpperCase() || "USER";
          token.isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(role);
        }

        console.log("🔐 JWT callback - User sign in:", {
          role: token.role,
          isAdmin: token.isAdmin,
          userId: token.id,
        });
      }

      // Always ensure isAdmin is set based on current role
      // Ini penting untuk existing tokens yang tidak memiliki isAdmin
      if (token.role && token.isAdmin === undefined) {
        const isAdminValue = ["ADMIN", "SUPER_ADMIN"].includes(token.role);
        token.isAdmin = isAdminValue;
        console.log("🔐 JWT callback - Setting missing isAdmin:", {
          role: token.role,
          isAdmin: token.isAdmin,
        });
      }

      // Handle session updates (if using useSession update)
      if (trigger === "update" && session) {
        console.log("🔐 JWT callback - Session update:", session);
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
        session.user.isActive = token.isActive as boolean;

        // PERBAIKAN Kritis: Pastikan isAdmin selalu ada dan benar
        // Priority 1: Gunakan isAdmin dari token jika ada
        if (typeof token.isAdmin === "boolean") {
          session.user.isAdmin = token.isAdmin;
        } else {
          // Priority 2: Hitung dari role jika isAdmin tidak ada di token
          const role = token.role?.toUpperCase() || "USER";
          session.user.isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(role);
        }

        console.log("🔐 Session callback - Final session:", {
          role: session.user.role,
          isAdmin: session.user.isAdmin,
          tokenHasIsAdmin: "isAdmin" in token,
          tokenIsAdminValue: token.isAdmin,
        });
      }
      return session;
    },

async redirect({ url, baseUrl }) {
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }
  if (new URL(url).origin === baseUrl) {
    return url;
  }
  return baseUrl;
},

    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // jika user baru via Google, set default role
if (!existingUser && account?.provider === "google") {
  await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      image: user.image,
      role: "user",
      isActive: true,
    },
  });
}


      return true;
    },
  },

  events: {
    async createUser({ user }) {
      if (!user.email) return;
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!dbUser?.role) {
        await prisma.user.update({
          where: { email: user.email },
          data: { role: "user", isActive: true },
        });
      }
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
