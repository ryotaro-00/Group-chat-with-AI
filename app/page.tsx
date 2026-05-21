import Link from "next/link";

const routes = [
  { href: "/register", label: "新規登録" },
  { href: "/groups", label: "グループ一覧" },
  { href: "/groups/team-alpha/chat", label: "チャット画面（サンプル）" },
  {
    href: "/groups/team-alpha/ai-threads",
    label: "AI質問一覧（サンプル）",
  },
  {
    href: "/groups/team-alpha/ai-threads/thread-001",
    label: "AI質問詳細（サンプル）",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-bold">ログイン</h1>
      <input className="rounded border p-2" placeholder="メールアドレス" />
      <input className="rounded border p-2" placeholder="パスワード" type="password" />
      <button className="rounded bg-blue-600 px-4 py-2 text-white">ログイン</button>
      <Link className="text-sm text-blue-600 underline" href="/register">
        新規登録はこちら
      </Link>

      <hr className="my-2" />
      <p className="text-sm text-zinc-600">画面確認用リンク</p>
      <ul className="space-y-2">
        {routes.map((route) => (
          <li key={route.href}>
            <Link className="text-sm text-blue-600 underline" href={route.href}>
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}