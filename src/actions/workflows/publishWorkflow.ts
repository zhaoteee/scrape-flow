"use server";

import prisma from "@/lib/prisma";
import FlowToExecutionPlan from "@/lib/workflow/FlowToExecutionPlan";
import { CalculateWrokflowCost } from "@/lib/workflow/helpers";
import { WorkflowStaus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

export async function PublishWorkflow({
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
  const flow = JSON.parse(defintion);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("flow defintion not valid");
  }
  if (!result.exectionPlan) {
    throw new Error("no execution plan generated");
  }
  const creditsCost = CalculateWrokflowCost(flow.nodes);

  await prisma.workflow.update({
    data: {
      defintion,
      executionPlan: JSON.stringify(result.exectionPlan),
      creditsCost,
      status: WorkflowStaus.PUBLISHED,
    },
    where: {
      id,
      userId,
    },
  });
  revalidatePath(`/workflow/editor/${id}`);
}
