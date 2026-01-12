// app/api/auth/[...nextauth]/route.ts - FIXED VERSION
import NextAuth, { type DefaultSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ==================== TYPE EXTENSIONS ====================
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      isActive?: boolean;
      isAdmin?: boolean;
    } & DefaultSession["user"]
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

// ==================== AUTH OPTIONS ====================
export const authOptions: NextAuthOptions = {
  // Database adapter
  adapter: PrismaAdapter(prisma),
  
  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // ==================== FIXED PAGES CONFIG ====================
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  // ==================== PROVIDERS ====================
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.email?.split('@')[0] || 'User',
          email: profile.email,
          image: profile.picture,
          role: "USER", // ⬅️ GUNAKAN UPPERCASE konsisten dengan database
          isActive: true,
          phone: null,
        };
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // Credentials (Email/Password)
    CredentialsProvider({
      id: "credentials",
      name: "Email dan Password",
      credentials: {
        email: { 
          label: "Email", 
          type: "email", 
          placeholder: "admin@sitalaris.com" 
        },
        password: { 
          label: "Password", 
          type: "password",
          placeholder: "••••••••" 
        },
      },
      async authorize(credentials) {
        try {
          // Validation
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email dan password harus diisi");
          }
          
          const email = credentials.email.toLowerCase().trim();
          
          // Find user
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
              emailVerified: true,
              phone: true,
            },
          });
          
          // User not found
          if (!user) {
            throw new Error("Email tidak terdaftar");
          }
          
          // Account inactive
          if (!user.isActive) {
            throw new Error("Akun dinonaktifkan. Hubungi administrator.");
          }
          
          // Check password (for users without password, they must use OAuth)
          if (!user.password) {
            throw new Error("Akun ini menggunakan metode login lain (Google)");
          }
          
          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Password salah");
          }
          
          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });
          
          // Return user object for JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            isActive: user.isActive,
            image: user.image,
          };
          
        } catch (error: any) {
          console.error("Auth error:", error.message);
          throw new Error(error.message || "Terjadi kesalahan saat login");
        }
      },
    }),
  ],
  
  // ==================== CALLBACKS ====================
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role.toUpperCase(); // ⬅️ Normalize role to uppercase
        token.phone = user.phone;
        token.isActive = user.isActive;
      }
      
      // Update session
      if (trigger === "update" && session) {
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
        
        // Add admin check helper (gunakan UPPERCASE untuk konsisten)
        session.user.isAdmin = token.role === "ADMIN" || token.role === "SUPER_ADMIN";
      }
      
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // ==================== FIXED REDIRECT LOGIC ====================
      console.log("Redirect callback called:", { url, baseUrl });
      
      // Handle callback URLs (OAuth returns)
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/`; // Redirect ke root setelah OAuth
      }
      
      // Handle new user redirect (Google signup)
      if (url.includes('/register')) {
        return `${baseUrl}/dashboard`;
      }
      
      // Default redirect to dashboard
      return `${baseUrl}/dashboard`;
    },
    
    async signIn({ user, account, profile, isNewUser }) {
      try {
        console.log("Sign in attempt:", {
          userId: user.id,
          email: user.email,
          provider: account?.provider,
          isNewUser,
          timestamp: new Date().toISOString(),
        });
        
        // Handle Google signup - update role jika user baru
        if (isNewUser && account?.provider === 'google') {
          console.log("New Google user, updating role...");
          
          // Pastikan role ada untuk user Google
          if (!user.role) {
            await prisma.user.update({
              where: { email: user.email! },
              data: { 
                role: "USER",
                isActive: true,
              },
            });
            console.log("Updated new Google user role to USER");
          }
        }
        
        return true;
        
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
  },
  
  // ==================== EVENTS ====================
  events: {
    async createUser({ user }) {
      console.log("New user created via:", user.email);
      
      // For Google users, ensure they have proper role
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true }
        });
        
        if (!dbUser?.role) {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "USER" }
          });
          console.log("Set default role for new user:", user.email);
        }
      }
    },
    
    async signIn({ user, account, isNewUser }) {
      console.log("User signed in:", {
        email: user.email,
        isNewUser,
        provider: account?.provider,
      });
    },
    
    async signOut({ token }) {
      console.log("User signed out:", token?.email);
    },
  },
  
  // ==================== CONFIGURATION ====================
  secret: process.env.NEXTAUTH_SECRET,
  
  // Security
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  
  // Debug in development
  debug: process.env.NODE_ENV === "development",
  
  // Theme (optional)
  theme: {
    colorScheme: "light",
    brandColor: "#2563eb", // blue-600
    logo: "/logo.png", // optional
  },
};

// ==================== API HANDLER ====================
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };