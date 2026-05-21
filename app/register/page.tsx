import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-bold">新規登録</h1>
      <input className="rounded border p-2" placeholder="名前" />
      <input className="rounded border p-2" placeholder="メールアドレス" />
      <input className="rounded border p-2" placeholder="パスワード" type="password" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white">登録する</button>
      <Link className="text-sm text-blue-600 underline" href="/">
        ログインに戻る
      </Link>
    </main>
  );
}