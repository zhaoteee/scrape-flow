import { cn } from "@/lib/utils";
import { WorkflowExcutionStatus } from "@/types/workflow";
import React from "react";

const colors: Record<WorkflowExcutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  FAILED: "bg-red-400",
  COMPLETED: "bg-emerald-600",
};
export default function ExecutionStatusIndicator({
  status,
}: {
  status: WorkflowExcutionStatus;
}) {
  return <div className={cn("w-2 h-2 rounded-full", colors[status])}></div>;
}

const labelColors: Record<WorkflowExcutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  FAILED: "text-red-400",
  COMPLETED: "text-emerald-600",
};
export function ExecutionStatusLabel({
  status,
}: {
  status: WorkflowExcutionStatus;
}) {
  return <span className={cn("lowercase", labelColors[status])}>{status}</span>;
}
