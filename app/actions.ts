"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type RegisterState = {
  status: "success" | "error";
  message: string;
} | null;

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (email.length === 0 || password.length === 0) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.passwordHash !== password) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set("userId", String(user.id), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  redirect("/groups");
}

export async function register(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (name.length === 0 || email.length === 0 || password.length === 0) {
    return {
      status: "error",
      message: "未入力の項目があります。",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      status: "error",
      message: "すでにこのアカウントは存在しています。",
    };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: password,
    },
  });

  return {
    status: "success",
    message: "登録しました。ログインしてください。",
  };
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("userId");

  redirect("/");
}
