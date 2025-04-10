"use server";

import { PeriodToDateRange } from "@/lib/helpers/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExcutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function GetStasCardsValues(perid: Period) {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthenticated");
  const dateRange = PeriodToDateRange(perid);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [WorkflowExcutionStatus.COMPLETED, WorkflowExcutionStatus.FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: { not: null },
        },
        select: { creditsConsumed: true },
      },
    },
  });
  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecution: 0,
  };
  stats.creditsConsumed = executions.reduce(
    (sum, execution) => (sum += execution.creditsConsumed),
    0
  );
  stats.phaseExecution = executions.reduce(
    (sum, execution) => (sum += execution.phases.length),
    0
  );
  return stats;
}
