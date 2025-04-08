"use client";

import updateWorkflowCron from "@/actions/workflows/updateWorkflowCron";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";
import removeWorrkflowSchedule from "@/actions/workflows/removeWorrkflowSchedule";
export default function SchedulerDialog(props: {
  workflowId: string;
  cron: string | null;
}) {
  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");
  const mutation = useMutation({
    mutationFn: updateWorkflowCron,
    onSuccess() {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError() {
      toast.error("Schedule updated failed", { id: "cron" });
    },
  });
  const removeMutation = useMutation({
    mutationFn: removeWorrkflowSchedule,
    onSuccess() {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError() {
      toast.error("Schedule updated failed", { id: "cron" });
    },
  });
  useEffect(() => {
    try {
      CronExpressionParser.parse(cron);
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);
  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCorn =
    workflowHasValidCron && cronstrue.toString(props.cron!);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"link"}
          size={"sm"}
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            workflowHasValidCron && "text-primary"
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCorn}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="h-3 w-3" /> Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="pd-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        ></CustomDialogHeader>
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-xs">
            Specify a cron expression to schedule periodic workflow execution.
            All times arre in UTC
          </p>
          <Input
            placeholder="E.g. * * * * *"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div
            className={cn(
              "bg-accent rounded-md p-4 border text-sm border-destructive text-destructive",
              validCron && "border-primary text-primary"
            )}
          >
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div>
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  disabled={mutation.isPending || removeMutation.isPending}
                  variant={"outline"}
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: "cron" });
                    removeMutation.mutate(props.workflowId);
                  }}
                >
                  Remove current schedule
                </Button>
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={"secondary"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={mutation.isPaused || !validCron}
              className="w-full"
              onClick={() => {
                toast.loading("Saving", { id: "cron" });
                mutation.mutate({
                  id: props.workflowId,
                  cron,
                });
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
