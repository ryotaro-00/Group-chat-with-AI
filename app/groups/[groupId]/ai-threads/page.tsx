import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
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

  const currentTeamId = team.id;

  async function createAiThread(formData: FormData) {
    "use server";

    const title = String(formData.get("title") ?? "").trim();

    if (title.length === 0) {
      return;
    }

    const cookieStore = await cookies();
    const userId = Number(cookieStore.get("userId")?.value);

    if (!Number.isInteger(userId)) {
      throw new Error("ログイン中のユーザーが見つかりません。ログインしてください。");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("ログイン中のユーザーがDBに見つかりません。");
    }

    const newThread = await prisma.aiThread.create({
      data: {
        teamId: currentTeamId,
        title,
        createdBy: user.id,
      },
    });

    redirect(`/groups/${groupId}/ai-threads/${newThread.id}`);
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
      <form action={createAiThread} className="flex gap-2 rounded border p-4">
        <input
          className="min-w-0 flex-1 rounded border p-2"
          name="title"
          placeholder="新しい質問スレッドのタイトル"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">
          作成
        </button>
      </form>
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
