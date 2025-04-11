"use server";

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { CreateWorkflowSchema, createWorkflowSchema } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStaus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export default async function CreateWorkflow(form: CreateWorkflowSchema) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const intialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  intialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  const workflow = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStaus.DRAFT,
      defintion: JSON.stringify(intialFlow),
      name: data.name || "",
      description: data.description || "",
    },
  });
  if (!workflow) {
    throw new Error("Failed to create workflow");
  }
  redirect(`/workflow/editor/${workflow.id}`); // Redirect to the workflow page
}
