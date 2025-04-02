import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React, { ReactNode } from "react";
import NodeParamField from "./NodeParamField";

export function NodeOutputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeOutput({
  output,
  nodeId,
}: {
  output: TaskParam;
  nodeId: string;
}) {
  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      {output.name}
    </div>
  );
}
