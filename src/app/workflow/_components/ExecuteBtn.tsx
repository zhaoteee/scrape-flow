"use client";

import UseExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = UseExecutionPlan();
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        console.log("-----plan-----");
        console.log(plan);
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
};

export default ExecuteBtn;
