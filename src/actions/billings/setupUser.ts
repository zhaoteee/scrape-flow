"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function setupUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthenticated");
  const balance = await prisma.userBalance.findUnique({ where: { userId } });
  if (!balance) {
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100,
      },
    });
  }
  redirect("/");
}
