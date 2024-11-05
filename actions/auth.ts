/** @format */

"use server";

import { loginSchema } from "@/app/lib/zodSchema";
import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { parseWithZod } from "@conform-to/zod";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const login = async (provider: string) => {
  await signIn(provider, { redirectTo: "/" });
  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

export const loginWithCreds = async (formData: FormData) => {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/",
  };

  const subimission = parseWithZod(formData, {
    schema: loginSchema,
  });
  if (subimission.status !== "success") {
    return subimission.reply();
  }

  const existingUser = await getUserByEmail(formData.get("email") as string);
  console.log(existingUser);

  try {
    await signIn("credentials", rawFormData);
  } catch (error: any) {
    console.log("my__errors", error.type);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
  revalidatePath("/");
};

export const registerMe = async (prevState: unknown, formData: FormData) => {
  const rawFormData = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
    redirectTo: "/",
  };

  const existingUser = await getUserByEmail(formData.get("email") as string);
  console.log("currentuser", existingUser);

  try {
    await signIn("credentials", rawFormData);
  } catch (error: any) {
    console.log("my__errors", error.type);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        case "CallbackRouteError":
          return { error: "Wrong data given?" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
  revalidatePath("/");
};
