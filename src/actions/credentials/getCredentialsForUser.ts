"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function getCredentialsForUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }
  return prisma.credential.findMany({
    where: { userId },
    orderBy: {
      name: "desc",
    },
  });
}
