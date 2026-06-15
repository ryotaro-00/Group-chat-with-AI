import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AiThreadsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const teamId = Number(groupId);

  const team = await prisma.team.findFirst({
    where: Number.isInteger(teamId) ? { id: teamId } : { name: "開発チームA" },
    include: {
      aiThreads: {
        include: {
          creator: true,
          _count: {
            select: { messages: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!team) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-bold">AI質問一覧: {team.name}</h1>
      <nav className="flex gap-4 text-sm">
        <Link className="text-blue-600 underline" href="/groups">
          グループ一覧
        </Link>
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/chat`}>
          チャット
        </Link>
        <Link className="text-blue-600 underline" href={`/groups/${groupId}/ai-threads`}>
          AI質問
        </Link>
      </nav>
      <ul className="space-y-3">
        {team.aiThreads.map((thread) => (
          <li key={thread.id} className="rounded border p-4">
            <p className="font-medium">{thread.title}</p>
            <p className="text-sm text-zinc-500">
              status: {thread.status} / 作成者: {thread.creator.name} / メッセージ{" "}
              {thread._count.messages}件
            </p>
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
