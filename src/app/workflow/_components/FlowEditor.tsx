"use client";

import { Workflow } from "@prisma/client";
import React, { useCallback, useEffect } from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";
import { AppNode } from "@/types/appNode";
import DeletableEdges from "./edges/DeletableEdges";
import { TaskRegistry } from "@/lib/workflow/task/registry";

const nodeTypes = {
  Node: NodeComponent,
};
const edgeTypes = {
  default: DeletableEdges,
};
const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 0.5 };
export default function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.defintion);
      if (!flow) return;
      setNodes(flow.nodes);
      setEdges(flow.edges);
      if (!flow.viewport) return;
      setViewport(flow.viewport);
    } catch (error) {}
  }, []);

  const onDargOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if (!taskType) return;
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes((nds) => nds.concat(newNode));
  }, []);
  const onConnection = useCallback(
    (connect: Connection) => {
      setEdges((eds) => addEdge({ ...connect, animated: true }, eds));
      if (!connect.targetHandle) return;
      const node = nodes.find((nd) => nd.id === connect.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      delete nodeInputs[connect.targetHandle];
      updateNodeData(node.id, { input: nodeInputs });
    },
    [nodes, updateNodeData, setEdges]
  );
  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (connection.source == connection.target) return false;
      // same taskParam type connection
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if (!source || !target) {
        console.error("invalid connction: source or target node not found");
        return false;
      }
      const sourceTask = TaskRegistry[source.data.type];
      const targetTask = TaskRegistry[target.data.type];
      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      );
      const input = targetTask.inputs.find(
        (o) => o.name === connection.targetHandle
      );
      if (input?.type !== output?.type) {
        console.error("invalid connection: type mismatch");
        return false;
      }
      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);
        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };
      const detectedCycle = hasCycle(target);
      return !detectedCycle;
    },
    [nodes, getOutgoers, edges]
  );
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDargOver}
        onDrop={onDrop}
        onConnect={onConnection}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Lines} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}
