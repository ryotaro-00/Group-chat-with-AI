import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");

  if (!userId) {
    redirect("/");
  }

  return children;
}
