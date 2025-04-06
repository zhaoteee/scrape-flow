"use client";

import { GetWorkflowExecutionWithPhase } from "@/actions/workflows/GetWorkflowExecutionWithPhase";
import { WorkflowExcutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import {
  CalculatorIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatesToDurationString } from "@/lib/helpers/dates";
import { GetPhasesTotalCost } from "@/lib/helpers/phases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhase>>;

export default function ExcutionViewer({
  initialData,
}: {
  initialData: ExecutionData;
}) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () =>
      GetWorkflowExecutionWithPhase({ executionId: initialData!.id }),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExcutionStatus.RUNNING ? 1000 : false,
  });
  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  });
  const duration = DatesToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  );
  const creditConsumed = GetPhasesTotalCost(query.data?.phases || []);
  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] h-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col  ">
        <div>
          <ExcutionLable
            icon={CircleDashedIcon}
            label="Status"
            value={query.data?.status}
          />
          <ExcutionLable
            icon={CalculatorIcon}
            label="Started at"
            value={
              <span className="lowercase">
                {query.data?.startedAt
                  ? formatDistanceToNow(new Date(query.data.startedAt))
                  : "-"}
              </span>
            }
          />
          <ExcutionLable
            icon={ClockIcon}
            label="Duration"
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExcutionLable
            icon={CoinsIcon}
            label="Credits consumed"
            value={creditConsumed}
          />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
            <span className="font-semibold">Phase</span>
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4">
          {query.data?.phases.map((phase, index) => {
            return (
              <Button
                key={phase.id}
                className="w-full justify-between"
                variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                onClick={() => {
                  setSelectedPhase(phase.id);
                }}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{phase.status}</p>
              </Button>
            );
          })}
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
      </div>
    </div>
  );
}

function ExcutionLable({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: ReactNode;
  value: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="font-semibold capitalize flex gap-2 items-center">
        <Icon size={20} className="stroke-muted-foreground" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex gap-2 items-center">
        {value}
      </div>
    </div>
  );
}
