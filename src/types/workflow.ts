import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "./task";
import { AppNode } from "./appNode";

export enum WorkflowStaus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
};

export type WorkflowExcutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type WorkflowExcutionPlan = WorkflowExcutionPlanPhase[];

export enum WorkflowExcutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
export enum WorkflowExcutionTrigger {
  MANUAL = "MANUAL",
  CRON = "CRON",
}
export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
