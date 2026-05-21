import Link from "next/link";

const threads = [
  { id: "thread-001", title: "Prisma migrate 手順", status: "pending" },
  { id: "thread-002", title: "認証方式の選定", status: "unresolved" },
];

export default async function AiThreadsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-bold">AI質問一覧: {groupId}</h1>
      <nav className="flex gap-4 text-sm">
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/chat`}>
          チャット
        </Link>
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/ai-threads`}>
          AI質問
        </Link>
      </nav>
      <ul className="space-y-3">
        {threads.map((thread) => (
          <li key={thread.id} className="rounded border p-4">
            <p className="font-medium">{thread.title}</p>
            <p className="text-sm text-zinc-500">status: {thread.status}</p>
            <Link
              className="mt-2 inline-block text-sm text-blue-600 underline"
              href={`/groups/${groupId}/ai-threads/${thread.id}`}
            >
              詳細を見る
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}