"use server";

import prisma from "@/lib/prisma";
import { WorkflowStaus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

export async function UnPublishWorkflow({ id }: { id: string }) {
  const { userId } = await auth();
  if (!userId) throw new Error("unathenticated");
  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!workflow) throw new Error("workflow not found");
  if (workflow.status !== WorkflowStaus.PUBLISHED) {
    throw new Error("workflow is not published");
  }

  await prisma.workflow.update({
    data: {
      executionPlan: null,
      creditsCost: 0,
      status: WorkflowStaus.DRAFT,
    },
    where: {
      id,
      userId,
    },
  });
  revalidatePath(`/workflow/editor/${id}`);
}
