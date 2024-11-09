/** @format */

import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { saltAndHashPassword } from "./utils/helper";
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
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        let username = credentials.username as string;
        let password = credentials.password as string;
        //trim removes head and tail whitespaces, replaceAll removes inbetween whitespaces
        username = username.trim().replaceAll(/\s*/g, "");
        password = password.trim().replaceAll(/\s*/g, "");
        const hash = saltAndHashPassword(password);

        let user: any = await db.user.findUnique({
          where: {
            email,
            // works also  username,
          },
        });

        if (!user) {
          try {
            user = await db.user.create({
              data: {
                email,
                username,
                hashedPassword: hash,
              },
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          // const isMatch = bcrypt.compareSync(
          //   credentials.password as string,
          //   user.hashedPassword
          // );
          // if (!isMatch) {
          //   throw new Error("Incorrect password.");
          // }
          //do nothing
          cookies().set("errReg", "User exists, login now!", { secure: true });
          return false;
        }
        cookies().set("regs", "Successfully registered", { secure: true });
        return user;
      },
    }),
  ],
});
