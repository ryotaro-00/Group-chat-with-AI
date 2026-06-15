import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const groups = await prisma.team.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-bold">グループ一覧</h1>
      <ul className="space-y-3">
        {groups.map((group) => (
          <li key={group.id} className="rounded border p-4">
            <p className="font-medium">{group.name}</p>
            <div className="mt-2 flex gap-4 text-sm">
              <Link className="text-blue-600 underline" href={`/groups/${group.id}/chat`}>
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
    </main>
  );
}
