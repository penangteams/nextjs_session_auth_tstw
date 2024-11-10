/** @format */

"use client";
import React, { useEffect } from "react";
import { loginWithCreds } from "@/actions/auth";
import AuthButton from "./AuthButton";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { loginSchema } from "@/app/lib/zodSchema";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";

const LoginForm = () => {
  // @ts-ignore
  const [lastResult, action] = useFormState<State, FormData>(
    loginWithCreds,
    undefined
  );
  const [cookies, setCookie, removeCookie] = useCookies(["name", "error2"]);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: loginSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  useEffect(() => {
    // ref auth.ts line 64, works but cookie better
    // if (lastResult?.error) {
    //   toast(lastResult?.error);
    // }
    if (cookies?.error2) {
      toast(cookies?.error2);
      removeCookie("error2");
    }
    if (cookies?.name) {
      toast(cookies?.name);
      removeCookie("name");
    }
  }, [lastResult, cookies]);
  return (
    <div>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
        className="w-full flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            id="Username"
            name={fields.username.name}
            className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
          <p className="text-red-300 text-sm font-semibold mt-[.5px]">
            {fields.username.errors}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
          />
          <p className="text-red-300 text-sm font-semibold mt-[.5px]">
            {fields.password.errors}
          </p>
        </div>
        <div className="mt-4">
          <AuthButton label="Sign in" />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
