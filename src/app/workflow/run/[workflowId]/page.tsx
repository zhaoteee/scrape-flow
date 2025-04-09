import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import Topbar from "../../_components/Topbar";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { waitFor } from "@/lib/helpers/waitFor";
import ExcutionsTable from "./_components/ExcutionsTable";

export default function ExecutionPage({
  params,
}: {
  params: { workflowId: string };
}) {
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={params.workflowId}
        hideButtons
        title="All runs"
        subtitle="List of all your workflow runs"
      />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon size={30} className="animate-spin stroke-primary" />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions || !executions.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        No data
      </div>
    );
  }

  return (
    <div className="container py-6 w-full">
      <ExcutionsTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}
