import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "./task";

export interface AppNodeData {
  type: TaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface AppNode extends Node {
  data: AppNodeData;
}

export interface OptionItem {
  label: string;
  value: string;
}
export interface ParamProps {
  param: TaskParam;
  disabled?: boolean;
  value: string;
  options?: OptionItem[];
  updateNodeParamValue: (newValue: string) => void;
}

export type AppNodeMissingInputs = {
  nodeId: string;
  inputs: string[];
};
