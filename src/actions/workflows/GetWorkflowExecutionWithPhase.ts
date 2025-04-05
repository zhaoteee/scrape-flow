"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutionWithPhase({
  executionId,
}: {
  executionId: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unathenticated");
  }
  return prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });
}
