import prisma from "@/lib/prisma";
import { ExcutionWorkflow } from "@/lib/workflow/excutionWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  WorkflowExcutionPlan,
  WorkflowExcutionStatus,
  WorkflowExcutionTrigger,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import { number } from "zod";

function isValidSecred(secret: string) {
  const APP_SECRET = process.env.APP_SECRET;
  if (!APP_SECRET) return false;
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(APP_SECRET));
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const secret = authHeader.split(" ")[1];
  if (!isValidSecred(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId") as string;
  if (!workflowId) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
  });
  if (!workflow) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExcutionPlan;
  if (!executionPlan) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId: workflow.userId,
      definition: workflow.defintion,
      status: WorkflowExcutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExcutionTrigger.CRON,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId: workflow.userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
  });
  await ExcutionWorkflow(execution.id);
  return new Response(null, { status: 200 });
}
