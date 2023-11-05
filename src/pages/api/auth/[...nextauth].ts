import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuidv4 } from "uuid";

import prisma from "@/utils/prisma";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.error("Authorization error:");

        if (!user) {
          return null; // User not found
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null; // Invalid password
        }

        // Safe user object for the token without the password
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: null,
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Ensure redirects always lead to your site's domain for added security
      return baseUrl;
    },

    async jwt({ token, user }) {
      // When a new session is initiated, populate the JWT with user info
      if (user) {
        token.id = String(user.id);
        token.email = String(user.email);
        token.firstName = String(user.firstName);
        token.lastName = String(user.lastName);
        token.role = String(user.role);
      } else {
        // Generate a unique identifier for a guest session if there is no user object
        token.guestSessionId = token.guestSessionId || uuidv4();
      }
      return token;
    },

    async session({ session, token }) {
      // Append user info to the session if there is a user
      if (token.id) {
        session.user = {
          id: String(token.id),
          firstName: String(token.firstName),
          lastName: String(token.lastName),
          email: String(token.email),
          role: token.role === "admin" ? "admin" : "user",
        };
      }
      // Add the guest session ID to the session object if present
      if (token.guestSessionId) {
        session.guestSessionId = String(token.guestSessionId);
      }
      return session;
    },
  },
});
