"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type AuthActionState = {
  status: "success" | "error";
  message: string;
} | null;

export async function login(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (email.length === 0 || password.length === 0) {
    return {
      status: "error",
      message: "メールアドレスとパスワードを入力してください。",
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.passwordHash !== password) {
    return {
      status: "error",
      message: "メールアドレスまたはパスワードが違います。",
    };
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
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
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

export async function createTeam(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("userId")?.value);

  if (!Number.isInteger(userId)) {
    redirect("/");
  }

  if (name.length === 0) {
    return;
  }

  await prisma.team.create({
    data: {
      name,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  revalidatePath("/groups");
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("userId");

  redirect("/");
}
