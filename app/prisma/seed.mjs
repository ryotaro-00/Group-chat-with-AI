import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./app/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "tanaka@example.com" },
    update: {
      name: "田中 太郎",
    },
    create: {
      name: "田中 太郎",
      email: "tanaka@example.com",
      passwordHash: "dummy-password-hash",
    },
  });

  let team = await prisma.team.findFirst({
    where: { name: "開発チームA" },
  });

  if (!team) {
    team = await prisma.team.create({
      data: {
        name: "開発チームA",
      },
    });
  }

  const teamMember = await prisma.teamMember.upsert({
    where: {
      teamId_userId: {
        teamId: team.id,
        userId: user.id,
      },
    },
    update: {
      role: "OWNER",
    },
    create: {
      teamId: team.id,
      userId: user.id,
      role: "OWNER",
    },
  });

  const existingMessage = await prisma.chatMessage.findFirst({
    where: {
      teamId: team.id,
      userId: user.id,
      content: "今日の進捗どうですか？",
    },
  });

  const chatMessage =
    existingMessage ??
    (await prisma.chatMessage.create({
      data: {
        teamId: team.id,
        userId: user.id,
        content: "今日の進捗どうですか？",
      },
    }));

  let aiThread = await prisma.aiThread.findFirst({
    where: {
      teamId: team.id,
      title: "Prisma seed の確認",
    },
  });

  if (!aiThread) {
    aiThread = await prisma.aiThread.create({
      data: {
        teamId: team.id,
        title: "Prisma seed の確認",
        status: "PENDING",
        createdBy: user.id,
      },
    });
  }

  const existingUserAiMessage = await prisma.aiMessage.findFirst({
    where: {
      threadId: aiThread.id,
      senderType: "USER",
      content: "seed で作ったデータを画面に表示したいです。",
    },
  });

  const userAiMessage =
    existingUserAiMessage ??
    (await prisma.aiMessage.create({
      data: {
        threadId: aiThread.id,
        senderType: "USER",
        userId: user.id,
        content: "seed で作ったデータを画面に表示したいです。",
      },
    }));

  const existingAiReply = await prisma.aiMessage.findFirst({
    where: {
      threadId: aiThread.id,
      senderType: "AI",
      content: "Prisma で DB から取得し、Next.js の Server Component で表示します。",
    },
  });

  const aiReply =
    existingAiReply ??
    (await prisma.aiMessage.create({
      data: {
        threadId: aiThread.id,
        senderType: "AI",
        content: "Prisma で DB から取得し、Next.js の Server Component で表示します。",
      },
    }));

  const userCount = await prisma.user.count();
  const teamCount = await prisma.team.count();
  const chatMessageCount = await prisma.chatMessage.count();
  const aiThreadCount = await prisma.aiThread.count();
  const aiMessageCount = await prisma.aiMessage.count();

  console.log(`Prisma is connected. Current user count: ${userCount}`);
  console.log(`Seeded user: ${user.name} (${user.email})`);
  console.log(`Current team count: ${teamCount}`);
  console.log(`Seeded team: ${team.name}`);
  console.log(`Connected user and team. Team member id: ${teamMember.id}`);
  console.log(`Current chat message count: ${chatMessageCount}`);
  console.log(`Seeded chat message: ${chatMessage.content}`);
  console.log(`Current AI thread count: ${aiThreadCount}`);
  console.log(`Seeded AI thread: ${aiThread.title}`);
  console.log(`Current AI message count: ${aiMessageCount}`);
  console.log(`Seeded AI messages: ${userAiMessage.id}, ${aiReply.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
