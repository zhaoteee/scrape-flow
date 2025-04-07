import { PublishWorkflow } from "@/actions/workflows/publishWorkflow";
import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import UseExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const PublishBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();
  const generate = UseExecutionPlan();
  const router = useRouter();
  const saveMutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("workflow published", { id: "publish-workflow" });
      router.push("/workflows");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong", { id: "publish-workflow" });
    },
  });
  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        if (!plan) return;
        const defintion = JSON.stringify(toObject());
        toast.loading("Publishing workflow...", { id: "publish-workflow" });
        saveMutation.mutate({ id: workflowId, defintion: defintion });
      }}
    >
      <UploadIcon size={20} className="stroke-green-400" />
      Publish
    </Button>
  );
};

export default PublishBtn;
