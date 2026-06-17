import Link from "next/link";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GroupChatPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const teamId = Number(groupId);

  const team = await prisma.team.findFirst({
    where: Number.isInteger(teamId) ? { id: teamId } : { name: "開発チームA" },
    include: {
      chatMessages: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!team) {
    notFound();
  }

  const currentTeamId = team.id;

  async function createChatMessage(formData: FormData) {
    "use server";

    const content = String(formData.get("content") ?? "").trim();

    if (content.length === 0) {
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

    await prisma.chatMessage.create({
      data: {
        teamId: currentTeamId,
        userId: user.id,
        content,
      },
    });

    revalidatePath(`/groups/${groupId}/chat`);
  }

  async function deleteChatMessage(formData: FormData) {
    "use server";

    const messageId = Number(formData.get("messageId"));

    if (!Number.isInteger(messageId)) {
      return;
    }

    await prisma.chatMessage.delete({
      where: { id: messageId },
    });

    revalidatePath(`/groups/${groupId}/chat`);
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10">
      <h1 className="text-2xl font-bold">チャット: {team.name}</h1>
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
      <ul className="space-y-3 rounded border p-4">
        {team.chatMessages.map((message) => (
          <li key={message.id} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">
                {message.user.name} ・{" "}
                {message.createdAt.toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>{message.content}</p>
            </div>
            <form action={deleteChatMessage}>
              <input name="messageId" type="hidden" value={message.id} />
              <button className="text-sm text-red-600 underline" type="submit">
                削除
              </button>
            </form>
          </li>
        ))}
      </ul>
      <form action={createChatMessage} className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded border p-2"
          name="content"
          placeholder="メッセージを入力"
        />
        <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">
          投稿
        </button>
      </form>
    </main>
  );
}
