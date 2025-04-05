import { GetWorkflowExecutionWithPhase } from "@/actions/workflows/GetWorkflowExecutionWithPhase";
import Topbar from "@/app/workflow/_components/Topbar";
import { waitFor } from "@/lib/helpers/waitFor";
import { auth } from "@clerk/nextjs/server";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExcutionViewer from "./_components/ExcutionViewer";

export default function ExecutionViewerPage({
  params,
}: {
  params: {
    executionId: string;
    workflowId: string;
  };
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={params.workflowId}
        title="Workflow run details"
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons={true}
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhase({
    executionId,
  });

  if (!workflowExecution) {
    return <div>Not found</div>;
  }
  return <ExcutionViewer initialData={workflowExecution} />;
}
