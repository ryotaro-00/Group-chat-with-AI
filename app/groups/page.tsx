import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("userId")?.value);

  if (!Number.isInteger(userId)) {
    redirect("/");
  }

  const groups = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    orderBy: { id: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">所属チーム一覧</h1>
        <form action={logout}>
          <button className="text-sm text-red-600 underline" type="submit">
            ログアウト
          </button>
        </form>
      </div>

      {groups.length === 0 ? (
        <p className="rounded border border-dashed p-6 text-sm text-zinc-600">
          所属しているチームはありません。
        </p>
      ) : (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li key={group.id} className="rounded border p-4">
              <p className="font-medium">{group.name}</p>
              <div className="mt-2 flex gap-4 text-sm">
                <Link
                  className="text-blue-600 underline"
                  href={`/groups/${group.id}/chat`}
                >
                  チャット
                </Link>
                <Link
                  className="text-blue-600 underline"
                  href={`/groups/${group.id}/ai-threads`}
                >
                  AI質問
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
