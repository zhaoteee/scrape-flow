import { GetPerods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { GetStasCardsValues } from "@/actions/analytics/getStasCardsValues";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecutions";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import { GetCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import CreditUsageChart from "../billings/_components/CreditUsageChart";

function HomePage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const { month, year } = searchParams;
  const current = new Date();
  const period: Period = {
    month: month ? parseInt(month) : current.getMonth(),
    year: year ? parseInt(year) : current.getFullYear(),
  };
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <Suspense fallback={<Skeleton className="w-[180px] h-[40px]" />}>
          <PeriodSelectorWrapper period={period} />
        </Suspense>
      </div>
      <div className="h-full py-6 flex flex-col gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCrads selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <StatsExecutionStatus selectedPeriod={period} />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
          <CreditsUsageInPeriod selectedPeriod={period} />
        </Suspense>
      </div>
    </div>
  );
}

async function PeriodSelectorWrapper({ period }: { period: Period }) {
  const periods = await GetPerods();
  return <PeriodSelector periods={periods} defaultPeriod={period} />;
}

async function StatsCrads({ selectedPeriod }: { selectedPeriod: Period }) {
  const data = await GetStasCardsValues(selectedPeriod);
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]">
      <StatsCard
        title="Workflow execution"
        value={data.workflowExecutions}
        icon={CirclePlayIcon}
      ></StatsCard>
      <StatsCard
        title="Phase executions"
        value={data.phaseExecution}
        icon={WaypointsIcon}
      ></StatsCard>
      <StatsCard
        title="Credits consumed"
        value={data.creditsConsumed}
        icon={CoinsIcon}
      ></StatsCard>
    </div>
  );
}
function StatsCardSkeleton() {
  return (
    <div className="grid gap-3 lg:gap-8 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full h-[120px]" />
      ))}
    </div>
  );
}
async function StatsExecutionStatus({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={data} />;
}
async function CreditsUsageInPeriod({
  selectedPeriod,
}: {
  selectedPeriod: Period;
}) {
  const data = await GetCreditsUsageInPeriod(selectedPeriod);
  return (
    <CreditUsageChart
      title="Daily credits spend"
      description="Daily credit consumed selected period"
      data={data}
    />
  );
}
export default HomePage;
