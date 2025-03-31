"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function DeleteWorkflow(id: string) {
  if (!id) {
    throw new Error("Need a workflow id")
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated")
  }
  const workflow = await prisma.workflow.delete({
      where: {
        id, userId
      }
    });
    if (!workflow) {
      throw new Error("Failed to create workflow")
    }
    revalidatePath(`/workflows`)
}
