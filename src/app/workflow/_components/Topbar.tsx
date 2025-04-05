"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import ExecuteBtn from "./ExecuteBtn";

interface Props {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
}

const Topbar = ({ title, subtitle, workflowId, hideButtons }: Props) => {
  const router = useRouter();
  return (
    <header className="flex p-2 border-p-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
          <ChevronLeftIcon size={20} />
        </Button>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex gap-1 flex-1 justify-end">
          {hideButtons === false && (
            <>
              <ExecuteBtn workflowId={workflowId} />
              <SaveBtn workflowId={workflowId} />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
