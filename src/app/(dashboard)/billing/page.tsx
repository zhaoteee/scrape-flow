import { GetAvailableCredits } from "@/actions/billings/getAvailableCredits";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftRightIcon, CoinsIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreditsPurchase from "./_components/CreditsPurchase";
import { Period } from "@/types/analytics";
import { GetCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import CreditUsageChart from "./_components/CreditUsageChart";
import { GetUserPurchaseHistory } from "@/actions/billings/getUserPurchaseHistory";
import { InvoiceBtn } from "./_components/InvoiceBtn";

export default function BillingPage() {
  return (
    <div className="mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
}

async function BalanceCard() {
  const balance = await GetAvailableCredits();
  return (
    <Card className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden">
      <CardContent className="p-6 required items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Avilable Credits
          </h3>
          <p className="text-4xl font-bold text-primary">
            <ReactCountUpWrapper value={balance} />
          </p>
        </div>
        <CoinsIcon
          size={140}
          className="text-primary opacity-20 absolute bottom-0 right-0"
        />
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        When your credit balance reaches zero, your workflows will stop working
      </CardFooter>
    </Card>
  );
}

async function CreditUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };
  const data = await GetCreditsUsageInPeriod(period);
  return (
    <CreditUsageChart
      data={data}
      title="Credits consumed"
      description="Datily credit consumed in the current month"
    />
  );
}

async function TransactionHistoryCard() {
  const purchase = await GetUserPurchaseHistory();
  console.log(purchase);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ArrowLeftRightIcon className="h-6 w-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transactinon history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchase.length === 0 && (
          <p className="text-muted-foreground">No transactinons yet </p>
        )}
        {purchase.map((p) => {
          return (
            <div
              key={p.id}
              className="flex justify-between items-center py-3 border-b last:border-b-0"
            >
              <div>
                <p className="font-medium">{formateDate(p.date)}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
              <div className="text-right relative z-10">
                <p className="font-medium">
                  {formateAmount(p.amount, p.currency)}
                </p>
                <InvoiceBtn id={p.id} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function formateDate(date: Date) {
  return new Intl.DateTimeFormat("en-ZH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
function formateAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-ZH", {
    style: "currency",
    currency,
  }).format(amount / 100);
}
