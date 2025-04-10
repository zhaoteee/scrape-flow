"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period } from "@/types/analytics";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septempber",
  "October",
  "Noverber",
  "December",
] as const;

export default function PeriodSelector({
  periods,
  defaultPeriod,
}: {
  periods: Period[];
  defaultPeriod: Period;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      value={`${defaultPeriod.month}-${defaultPeriod.year}`}
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const param = new URLSearchParams(searchParams);
        param.set("month", month);
        param.set("year", year);
        router.push(`?${param.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>
            {`${MONTH_NAMES[period.month]}-${period.year}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
