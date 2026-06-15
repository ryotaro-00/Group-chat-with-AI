import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AiThreadDetailPage({
  params,
}: {
  params: Promise<{ groupId: string; threadId: string }>;
}) {
  const { groupId, threadId } = await params;
  const teamId = Number(groupId);
  const aiThreadId = Number(threadId);

  if (!Number.isInteger(aiThreadId)) {
    notFound();
  }

  const thread = await prisma.aiThread.findFirst({
    where: {
      id: aiThreadId,
      team: Number.isInteger(teamId) ? { id: teamId } : { name: "開発チームA" },
    },
    include: {
      team: true,
      creator: true,
      messages: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!thread) {
    notFound();
  }

  async function createAiQuestion(formData: FormData) {
    "use server";

    const content = String(formData.get("content") ?? "").trim();

    if (content.length === 0) {
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: "tanaka@example.com" },
    });

    if (!user) {
      throw new Error("投稿者のユーザーが見つかりません。seedを実行してください。");
    }

    await prisma.aiMessage.create({
      data: {
        threadId: thread.id,
        senderType: "USER",
        userId: user.id,
        content,
      },
    });

    await prisma.aiMessage.create({
      data: {
        threadId: thread.id,
        senderType: "AI",
        content: `仮の回答です。「${content}」については、あとでAI APIにつなげて回答を生成します。`,
      },
    });

    revalidatePath(`/groups/${groupId}/ai-threads/${threadId}`);
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-bold">AI質問詳細: {thread.title}</h1>
      <nav className="flex gap-4 text-sm">
        <Link className="text-blue-600 underline" href="/groups">
          グループ一覧
        </Link>
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/ai-threads`}>
          AI質問一覧
        </Link>
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/chat`}>
          チャット
        </Link>
      </nav>
      <section className="rounded border p-4">
        <p className="mb-3 text-sm text-zinc-500">
          グループ: {thread.team.name} / 作成者: {thread.creator.name} / ステータス:{" "}
          {thread.status}
        </p>
        <ul className="space-y-3">
          {thread.messages.map((message) => (
            <li key={message.id}>
              <p className="text-xs uppercase text-zinc-500">
                {message.senderType}
                {message.user ? ` / ${message.user.name}` : ""}
              </p>
              <p>{message.content}</p>
            </li>
          ))}
        </ul>
      </section>
      <form action={createAiQuestion} className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded border p-2"
          name="content"
          placeholder="質問を入力"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">
          質問する
        </button>
      </form>
    </main>
  );
}
