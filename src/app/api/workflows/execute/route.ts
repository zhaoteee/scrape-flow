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
import { CronExpressionParser } from "cron-parser";
function isValidSecred(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  console.log("API_SECRET---", API_SECRET);
  if (!API_SECRET) return false;
  try {
    const val = timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
    console.log("val---", val);
    return val;
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
  console.log("secret", authHeader);
  if (!isValidSecred(secret)) {
    console.log("isValidSecred");
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
  try {
    const cron = CronExpressionParser.parse(workflow.cron!, { tz: "UTC" });
    const nextRunAt = cron.next().toDate();
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
    await ExcutionWorkflow(execution.id, nextRunAt);
    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
}
