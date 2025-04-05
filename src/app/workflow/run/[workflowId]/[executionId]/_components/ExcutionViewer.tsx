"use client";

import { GetWorkflowExecutionWithPhase } from "@/actions/workflows/GetWorkflowExecutionWithPhase";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhase>>;

export default function ExcutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  return <div>ExcutionViewer</div>;
}
