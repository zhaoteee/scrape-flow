import { UnPublishWorkflow } from "@/actions/workflows/unPublishWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const UnpublishBtn = ({ workflowId }: { workflowId: string }) => {
  const router = useRouter();
  const saveMutation = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: () => {
      toast.success("workflow unpublished", { id: "unpublish-workflow" });
      router.push("/workflows");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Something went wrong", { id: "unpublish-workflow" });
    },
  });
  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading("Unpublishing workflow...", { id: "unpublish-workflow" });
        saveMutation.mutate({ id: workflowId });
      }}
    >
      <DownloadIcon size={20} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
};

export default UnpublishBtn;
