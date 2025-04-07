"use client";

import { GetWorkflowExecutionWithPhase } from "@/actions/workflows/GetWorkflowExecutionWithPhase";
import { ExecutionPhaseStatus, WorkflowExcutionStatus } from "@/types/workflow";
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
import { ReactNode, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatesToDurationString } from "@/lib/helpers/dates";
import { GetPhasesTotalCost } from "@/lib/helpers/phases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExecutionLog } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { logLevel } from "@/types/log";
import PhaseStatusBadge from "./PhaseStatusBadge";
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
  const isRunning = query.data?.status === WorkflowExcutionStatus.RUNNING;
  useEffect(() => {
    const phases = query.data?.phases || [];
    if (isRunning) {
      const phaseToSelect = phases.toSorted((a, b) =>
        a.startedAt! > b.startedAt! ? -1 : 1
      )[0];
      setSelectedPhase(phaseToSelect.id);
      return;
    }
    const phaseToSelect = phases.toSorted((a, b) =>
      a.completedAt! > b.completedAt! ? -1 : 1
    )[0];
    setSelectedPhase(phaseToSelect.id);
  }, [query.data?.phases, isRunning, setSelectedPhase]);
  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] h-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col  ">
        <div>
          <ExcutionLable
            icon={CircleDashedIcon}
            label="Status"
            value={
              <div className="font-semibold capitalize flex gap-2 items-center">
                <PhaseStatusBadge
                  status={query.data?.status as ExecutionPhaseStatus}
                />
                <span>{query.data?.status}</span>
              </div>
            }
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
                  if (isRunning) return;
                  setSelectedPhase(phase.id);
                }}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <PhaseStatusBadge
                  status={phase.status as ExecutionPhaseStatus}
                />
              </Button>
            );
          })}
        </div>
      </aside>
      <div className="flex w-full h-full">
        {isRunning && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold">Run is in progress, please wait</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <div className="font-bold">No phase selected</div>
            <p className="text-sm text-muted-foreground">
              Select a phase to view details
            </p>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <CoinsIcon size={18} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                <span>{phaseDetails.data.creditsConsumed}</span>
              </Badge>
              <Badge variant={"outline"} className="space-x-4">
                <div className="flex gap-1 items-center">
                  <ClockIcon size={18} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {DatesToDurationString(
                    phaseDetails.data.completedAt,
                    phaseDetails.data.startedAt
                  ) || "-"}
                </span>
              </Badge>
            </div>

            <ParamaterView
              title="Inputs"
              subTitle="Inputs used for this phase"
              paramsJson={phaseDetails.data.inputs}
            />
            <ParamaterView
              title="Outputs"
              subTitle="Outputs generated by this phase"
              paramsJson={phaseDetails.data.outputs}
            />

            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
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

function ParamaterView({
  title,
  subTitle,
  paramsJson,
}: {
  title: string;
  subTitle: string;
  paramsJson: string | null;
}) {
  const params = paramsJson ? JSON.parse(paramsJson) : undefined;

  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {!params ||
            (Object.keys(params).length === 0 && (
              <p className="text-sm">No parameters generated by this phasae</p>
            ))}
          {params &&
            Object.entries(params).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center space-y-1"
              >
                <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                  {key}
                </p>
                <Input
                  readOnly
                  className="flex-1 basis-2/3"
                  value={value as string}
                />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
  if (!logs || !logs.length) return null;
  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead className="w-[190px]">Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="text-muted-foreground">
                <TableCell className="text-xs text-muted-foreground p-[2px] pl-4">
                  {log.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  width={80}
                  className={cn(
                    "uppercase text-xs font-bold p-[3px] pl-4",
                    (log.logLevel as logLevel) === "error" &&
                      "text-destructive",
                    (log.logLevel as logLevel) === "info" && "text-primary"
                  )}
                >
                  {log.logLevel}
                </TableCell>
                <TableCell className="text-sm flex-1 p-[3px] pl-4">
                  {log.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
