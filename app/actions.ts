"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("userId");

  redirect("/");
}
