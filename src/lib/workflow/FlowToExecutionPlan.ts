import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
  WorkflowExcutionPlan,
  WorkflowExcutionPlanPhase,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

export enum FlowToExecutionPlanValidationError {
  "NO_ENTRY_POINT",
  "INVALID_IINPUTS",
}

type FlowToExecutionPlanType = {
  exectionPlan?: WorkflowExcutionPlan;
  error?: {
    type: FlowToExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};

const FlowToExecutionPlan = (
  nodes: AppNode[],
  edges: Edge[]
): FlowToExecutionPlanType => {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );
  if (!entryPoint) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }
  const inputsWidthErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidIInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWidthErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  const exectionPlan: WorkflowExcutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  planned.add(entryPoint.id);
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExcutionPlanPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // Node already put in the execution play.
        continue;
      }
      const invalidInputs = getInvalidIInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          console.error("invalid inputs", currentNode.id, invalidInputs);
          inputsWidthErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          // let's skp this node for now;
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    exectionPlan.push(nextPhase);
  }
  if (inputsWidthErrors.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_IINPUTS,
        invalidElements: inputsWidthErrors,
      },
    };
  }
  return { exectionPlan };
};
function getInvalidIInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      // this input is fine, so we can move on
      continue;
    }
    // If a value is not provided by the user then we need to check
    // if there is an output linked to the current input;
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedByOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );
    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedByOutput &&
      planned.has(inputLinkedByOutput.source);
    if (requiredInputProvidedByVisitedOutput) {
      // the inputs is required and we have a valid value for it
      // provided by a task that is already planned
      continue;
    } else if (!input.required) {
      // if the input is not required but there is an output linked to it
      // then we need to be suer that the output is already planned
      if (!inputLinkedByOutput) continue;
      if (inputLinkedByOutput && planned.has(inputLinkedByOutput.source)) {
        // the output is providing a value to the input: the input is fine;
        continue;
      }
    }
    invalidInputs.push(input.name);
  }
  return invalidInputs;
}
function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) return [];
  const incomerIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomerIds.add(edge.source);
    }
  });
  return nodes.filter((n) => incomerIds.has(n.id));
}
export default FlowToExecutionPlan;
