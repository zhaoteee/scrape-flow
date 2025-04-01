"use server";

import prisma from "@/lib/prisma";
import { WorkflowStaus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function UpdateWorkflow({
  id,
  defintion,
}: {
  id: string;
  defintion: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("unathenticated");
  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!workflow) throw new Error("workflow not found");
  if (workflow.status !== WorkflowStaus.DRAFT) {
    throw new Error("workflow is not a draft");
  }
  await prisma.workflow.update({
    data: {
      defintion,
    },
    where: {
      id,
      userId,
    },
  });

  //   redirect("/workflows");
}
