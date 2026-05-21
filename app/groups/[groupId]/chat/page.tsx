import Link from "next/link";

const messages = [
  { id: 1, user: "田中", text: "今日の進捗どうですか？", time: "09:15" },
  { id: 2, user: "佐藤", text: "ログイン画面まで完了しました。", time: "09:17" },
];

export default async function GroupChatPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-bold">チャット: {groupId}</h1>
      <nav className="flex gap-4 text-sm">
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/chat`}>
          チャット
        </Link>
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/ai-threads`}>
          AI質問
        </Link>
      </nav>
      <ul className="space-y-3 rounded border p-4">
        {messages.map((message) => (
          <li key={message.id}>
            <p className="text-sm text-zinc-500">
              {message.user} ・ {message.time}
            </p>
            <p>{message.text}</p>
          </li>
        ))}
      </ul>
      <input className="rounded border p-2" placeholder="メッセージを入力" />
    </main>
  );
}