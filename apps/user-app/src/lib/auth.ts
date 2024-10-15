/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable no-unused-vars */
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt"; // Type for JWT token
import { Session, User } from "next-auth"; // Type for session and user
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@repo/db/client";
import bcrypt from "bcryptjs";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    mobile: string;
    verification: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ): Promise<User | null> {
        if (!credentials) {
          throw new Error("Credentials not provided");
        }

        // Find the user by username
        const user = await prisma.user.findFirst({
          where: { username: credentials.username },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Return the user object which matches the User type
        return {
          id: user.id,
          username: user.username || "", // Ensure name is a non-null string
          mobile: user.mobile,
          verification: user.verification,
        };
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",

  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        // Add verification status and other fields to the token
        token.id = user.id;
        token.username = user.username;
        token.mobile = user.mobile;
        token.verification = user.verification;
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        // Assign the necessary values from token to session
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.mobile = token.mobile;
        session.user.verification = token.verification;
      }
      // console.log("Session Callback:", session); // Log the session
      return session;
    },
  },
};
