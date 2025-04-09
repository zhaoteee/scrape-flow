import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();
  const router = useRouter();
  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
      // router.push("/workflows");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });
  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const defintion = JSON.stringify(toObject());
        toast.loading("Save workflow...", { id: "save-workflow" });
        saveMutation.mutate({ id: workflowId, defintion: defintion });
      }}
    >
      <CheckIcon size={20} className="stroke-gray-400" />
      Save
    </Button>
  );
};

export default SaveBtn;
