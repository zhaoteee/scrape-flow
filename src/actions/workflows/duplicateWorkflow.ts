"use server";

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import {
  duplicateWorkflowSchema,
  DuplicateWorkflowSchemaType,
} from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStaus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function DuplicateWorkflow(
  form: DuplicateWorkflowSchemaType
) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
      userId,
    },
  });
  if (!workflow) {
    throw new Error("workflow not found");
  }
  const result = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      status: WorkflowStaus.DRAFT,
      defintion: workflow.defintion,
    },
  });
  if (!result) {
    throw new Error("failed to duplicate workflow");
  }
  revalidatePath(`/workflows`);
}
