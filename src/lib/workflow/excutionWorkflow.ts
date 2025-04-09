import "server-only";
import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExcutionStatus } from "@/types/workflow";
import { waitFor } from "../helpers/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { TaskRegistry } from "./task/registry";
import { AppNode } from "@/types/appNode";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";

export async function ExcutionWorkflow(executionId: string, nextRunAt?: Date) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      worklow: true,
      phases: true,
    },
  });
  if (!execution) {
    throw new Error("excution not found");
  }
  const edges = JSON.parse(execution.definition).edges as Edge[];
  // setup execution environment
  const environment: Environment = {
    phases: {},
  };

  // initialize workflow execution
  await initializeWorkflowExecution(
    executionId,
    execution.workflowId,
    nextRunAt
  );

  // initialize phase status
  await initializePhaseStatuses(execution);
  let creditsConsumed = 0;
  let excutionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await executionWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId
    );
    creditsConsumed += phase.creditsConsumed || 0;
    if (!phaseExecution.success) {
      excutionFailed = true;
      break;
    }
    // execute phase
  }

  // finalize execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    excutionFailed,
    creditsConsumed
  );

  // clean up environment
  await cleanupEnvironment(environment);
  revalidatePath("/workflow/run");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
  nextRunAt?: Date
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExcutionStatus.RUNNING,
    },
  });
  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExcutionStatus.RUNNING,
      lastRunId: executionId,
      ...(nextRunAt && { nextRunAt }),
    },
  });
}

async function initializePhaseStatuses(excution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: excution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExcutionStatus.FAILED
    : WorkflowExcutionStatus.COMPLETED;
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });
  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {
      // this means that we have triggered other runs for this worflow
      // while an execution was running
    });
}

async function executionWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
  useId: string
) {
  const logCollector = createLogCollector();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmentForPhase(node, environment, edges);
  // Update phase status
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt: new Date(),
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });
  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log(
    `Executing phase ${phase.name} with ${creditsRequired} credits requred`
  );

  // decrement user balance (with required credits);
  let success = await decrementCredits(useId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  // Execute phase simulation
  if (success) {
    success = await executePhase(phase, node, environment, logCollector);
  }
  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed
  );
  return { success, creditsConsumed };
}
async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;
  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timestamp,
          })),
        },
      },
    },
  });
}
async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    logCollector.error(`not found executor for ${node.data.type}`);
    return false;
  }
  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);
  return await runFn(executionEnvironment);
}

function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }
    // Get input value from outputs in the environment
    const connectedEdgs = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );
    if (!connectedEdgs) {
      console.error("Missing edge for input", input.name, "node id: ", node.id);
      continue;
    }
    const outputValue =
      environment.phases[connectedEdgs.source].outputs[
        connectedEdgs.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) => {
      environment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser.close().catch((err) => {
      console.error("cannot close browser, reason: ", err);
    });
  }
}

async function decrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector
) {
  try {
    await prisma.userBalance.update({
      where: { userId, credits: { gte: amount } },
      data: { credits: { decrement: amount } },
    });
    return true;
  } catch (error) {
    logCollector.error("insufficient balance");
    return false;
  }
}
