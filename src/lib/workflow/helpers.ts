import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

export function CalculateWrokflowCost(nodes: AppNode[]) {
  return nodes.reduce((acc, node) => {
    return acc + TaskRegistry[node.data.type].credits;
  }, 0);
}
