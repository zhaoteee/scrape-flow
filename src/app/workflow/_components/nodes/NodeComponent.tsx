import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const tasks = TaskRegistry[nodeData.type];
  return (
    <NodeCard nodeId={props.id} isSelected={props.selected}>
      <NodeHeader taskType={nodeData.type}></NodeHeader>
      <NodeInputs>
        {tasks.inputs.map((input) => {
          return <NodeInput key={input.name} input={input} nodeId={props.id} />;
        })}
      </NodeInputs>
      <NodeOutputs>
        {tasks.outputs.map((output) => {
          return (
            <NodeOutput key={output.name} output={output} nodeId={props.id} />
          );
        })}
      </NodeOutputs>
    </NodeCard>
  );
});
export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
