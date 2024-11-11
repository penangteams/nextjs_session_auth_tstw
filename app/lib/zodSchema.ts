/** @format */

import { z } from "zod";
//pipe
//https://stackoverflow.com/questions/77134910/how-can-i-remove-all-whitespace-in-zod
//https://stackoverflow.com/questions/77594561/how-to-remove-whitespace-from-within-a-string-using-zod
export const loginSchema = z.object({
  // username: z
  //   .string()
  //   .regex(/^[0-9]+$/, { message: "only numbers, " })
  //   .max(4, { message: "4 digits" })
  //   .min(4, { message: "4 digits" }),
  username: z
    .string()
    .refine((s) => !s.includes(" "), " no spaces!")
    .pipe(
      z
        .string()
        .min(5, { message: "Username must more than 4 characters," })
        .max(10, { message: "Username must less than 11 characters," })
        .regex(/^[^\W_].*[^\W_]$/, {
          message: " not use special characters at start or end",
        })
    ),

  password: z
    .string()
    .refine((s) => !s.includes(" "), " no spaces!")
    .pipe(
      z
        .string()
        .min(4, { message: "Password must more than 3 characters" })
        .max(8, { message: "Password must less than 9 characters" })
    ),
});

export const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .refine((s) => !s.includes(" "), " no spaces!")
    .pipe(
      z
        .string()
        .min(5, { message: "Username must more than 4 characters," })
        .max(10, { message: "Username must less than 11 characters," })
        .regex(/^[^\W_].*[^\W_]$/, {
          message: " not use special characters at start or end",
        })
    ),

  // does not count whitespace
  // username: z.coerce.number().int().lte(9999),
  // username: z
  //   .string()
  //   .trim()
  //   .transform((s, ctx) => {
  //     const withoutWhitespace = s.replaceAll(/\s*/g, "");
  //     if (withoutWhitespace.length <= 3) {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: "You must enter minimum 4 characters",
  //       });
  //       return z.NEVER;
  //     }
  //     return withoutWhitespace;
  //   }),

  password: z
    .string()
    .refine((s) => !s.includes(" "), " no spaces!")
    .pipe(
      z
        .string()
        .min(4, { message: "Password must more than 3 characters" })
        .max(8, { message: "Password must less than 9 characters" })
    ),
});
