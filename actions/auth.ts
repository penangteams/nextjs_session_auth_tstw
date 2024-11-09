/** @format */

"use server";
import { cookies } from "next/headers";
import { loginSchema } from "@/app/lib/zodSchema";
import { signIn as sReg, signOut } from "@/auth_reg";
import { signIn as sLog } from "@/auth_login";
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
  await sLog(provider, { redirectTo: "/" });
  revalidatePath("/");
};

export const logout = async () => {
  cookies().delete("name");
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

export const loginWithCreds = async (
  prevState: unknown,
  formData: FormData
) => {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/middleware",
  };

  const subimission = parseWithZod(formData, {
    schema: loginSchema,
  });
  if (subimission.status !== "success") {
    return subimission.reply();
  }

  // const existingUser = await getUserByEmail(formData.get("email") as string);
  // console.log(existingUser);

  try {
    await sLog("credentials", rawFormData);
  } catch (error: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          // works but set cookie better return { error: "Invalid credentials!" };
          cookies().set("error2", "Invalid credentials!", { secure: true });
          return { error: "Invalid credentials!" };
        default:
          // works but set cookie better return { error: "Something went wrong!" };
          cookies().set("error2", "Something went wrong!", { secure: true });
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
    redirectTo: "/middleware",
  };

  const existingUser = await getUserByEmail(formData.get("email") as string);
  console.log("currentuser", existingUser);

  try {
    await sReg("credentials", rawFormData);
  } catch (error: any) {
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
