"use server";

import { PeriodToDateRange } from "@/lib/helpers/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExcutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";
import { date } from "zod";
type Stats = Record<string, { success: number; failed: number }>;
const formatStr = "yyyy-MM-dd";
export async function GetWorkflowExecutionStats(perid: Period) {
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
    },
  });
  const stats: Stats = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, formatStr))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc;
    }, {} as any);
  executions.forEach((execution) => {
    const date = format(execution.startedAt!, formatStr);
    if (execution.status === WorkflowExcutionStatus.COMPLETED) {
      stats[date].success += 1;
    }
    if (execution.status === WorkflowExcutionStatus.FAILED) {
      stats[date].failed += 1;
    }
  });
  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));
  return result;
}
