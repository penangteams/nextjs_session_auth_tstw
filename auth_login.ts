/** @format */

import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { cookies } from "next/headers";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        username: {
          label: "Username",
          type: "text",
          placeholder: "username123",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }

        // const email = credentials.email as string;
        const username = credentials.username as string;

        let user: any = await db.user.findUnique({
          where: {
            username,
            // works also  email,
          },
        });

        if (!user) {
          // user = await db.user.create({
          //   data: {
          //     email,
          //     username,
          //     hashedPassword: hash,
          //   },
          // });
          //no actions
        } else {
          const isMatch = bcrypt.compareSync(
            credentials.password as string,
            user.hashedPassword
          );
          if (!isMatch) {
            throw new Error("Incorrect password.");
          }
          cookies().set("name", "Successfully logged in", { secure: true });
        }

        return user;
      },
    }),
  ],
});
