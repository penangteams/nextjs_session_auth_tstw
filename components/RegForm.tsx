/** @format */

"use client";
import React, { useEffect } from "react";
import AuthButton from "./AuthButton";
import { registerMe } from "@/actions/auth";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { registerSchema } from "@/app/lib/zodSchema";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";

const RegForm = () => {
  // @ts-ignore
  const [lastResult, action] = useFormState<State, FormData>(
    registerMe,
    undefined
  );
  const [cookies, setCookie, removeCookie] = useCookies(["regs", "errReg"]);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: registerSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    // works better with cookies
    // if (lastResult?.error) {
    //   toast(lastResult?.error);
    // }
    if (cookies?.errReg) {
      toast(cookies?.errReg);
      removeCookie("errReg");
    }
    if (cookies?.regs) {
      toast(cookies?.regs);
      removeCookie("regs");
    }
  }, [lastResult, cookies]);

  return (
    <div>
      <form
        className="w-full flex flex-col gap-4"
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
      >
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            id="Email"
            name={fields.email.name}
            // defaultValue={fields.email.initialValue}
            className="mt-1 w-full px-4 p-2  h-10 rounded-md border border-gray-200 bg-white text-sm text-gray-700"
            key={fields.email.key}
          />
          <p className="text-red-300 text-sm font-semibold mt-[.5px]">
            {fields.email.errors}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            id="Username"
            name="username"
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
          <AuthButton label="Sign up" />
        </div>
      </form>
    </div>
  );
};

export default RegForm;
