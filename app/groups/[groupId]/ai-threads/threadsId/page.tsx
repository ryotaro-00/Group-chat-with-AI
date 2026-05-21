import Link from "next/link";

const threadMessages = [
  { id: 1, sender: "user", content: "Prisma migrate の実行順を教えて" },
  { id: 2, sender: "ai", content: "schema更新→migrate dev→studio確認の順がおすすめです。" },
];

export default async function AiThreadDetailPage({
  params,
}: {
  params: Promise<{ groupId: string; threadId: string }>;
}) {
  const { groupId, threadId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-bold">AI質問詳細: {threadId}</h1>
      <div className="text-sm">
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/ai-threads`}>
          ← AI質問一覧へ
        </Link>
      </div>
      <div className="rounded border p-4">
        <p className="mb-2 text-sm text-zinc-500">ステータス: pending</p>
        <ul className="space-y-3">
          {threadMessages.map((message) => (
            <li key={message.id}>
              <p className="text-xs uppercase text-zinc-500">{message.sender}</p>
              <p>{message.content}</p>
            </li>
          ))}
        </ul>
      </div>
      <input className="rounded border p-2" placeholder="質問やコメントを入力" />
    </main>
  );
}