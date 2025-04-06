"use server";

import prisma from "@/lib/prisma";
import { ExcutionWorkflow } from "@/lib/workflow/excutionWorkflow";
import FlowToExecutionPlan from "@/lib/workflow/FlowToExecutionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExcutionPlan,
  WorkflowExcutionStatus,
  WorkflowExcutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unathenticated");
  }
  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("workflowId is required");
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });
  if (!workflow) {
    throw new Error("workflow not found");
  }
  let executionPlan: WorkflowExcutionPlan;
  if (!flowDefinition) {
    throw new Error("flow definition is not defined");
  }
  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error("flow definition not valid");
  }
  4;
  if (!result.exectionPlan) {
    throw new Error("no execution plan generated");
  }
  executionPlan = result.exectionPlan;
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExcutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExcutionTrigger.MANUAL,
      definition: flowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });
  if (!execution) {
    throw new Error("workflow execution not created");
  }
  ExcutionWorkflow(execution.id);
  redirect(`/workflow/run/${workflowId}/${execution.id}`);
}
