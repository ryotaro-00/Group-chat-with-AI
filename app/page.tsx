"use client";

import { useActionState, useState } from "react";
import { login, register } from "@/app/actions";

type AuthTab = "login" | "register";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [registerState, registerAction, isRegisterPending] = useActionState(
    register,
    null,
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-10">
      <div className="grid grid-cols-2 rounded border p-1">
        <button
          className={`rounded px-4 py-2 text-sm font-medium ${
            activeTab === "login" ? "bg-blue-600 text-white" : "text-zinc-700"
          }`}
          onClick={() => setActiveTab("login")}
          type="button"
        >
          ログイン
        </button>
        <button
          className={`rounded px-4 py-2 text-sm font-medium ${
            activeTab === "register" ? "bg-blue-600 text-white" : "text-zinc-700"
          }`}
          onClick={() => setActiveTab("register")}
          type="button"
        >
          新規登録
        </button>
      </div>

      {activeTab === "login" ? (
        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <form action={login} className="flex flex-col gap-4">
            <input
              className="rounded border p-2"
              name="email"
              placeholder="メールアドレス"
              type="email"
            />
            <input
              className="rounded border p-2"
              name="password"
              placeholder="パスワード"
              type="password"
            />
            <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">
              ログイン
            </button>
          </form>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">新規登録</h1>
          <form action={registerAction} className="flex flex-col gap-4">
            <input
              className="rounded border p-2"
              name="name"
              placeholder="ユーザー名"
              type="text"
            />
            <input
              className="rounded border p-2"
              name="email"
              placeholder="メールアドレス"
              type="email"
            />
            <input
              className="rounded border p-2"
              name="password"
              placeholder="パスワード"
              type="password"
            />
            <button
              className="rounded bg-zinc-900 px-4 py-2 text-white disabled:bg-zinc-400"
              disabled={isRegisterPending}
              type="submit"
            >
              {isRegisterPending ? "登録中..." : "登録する"}
            </button>
          </form>

          {registerState ? (
            <p
              className={`rounded border px-3 py-2 text-sm ${
                registerState.status === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {registerState.message}
            </p>
          ) : null}
        </section>
      )}
    </main>
  );
}
