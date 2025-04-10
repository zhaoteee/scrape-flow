"use client";

import { DownloadInvoice } from "@/actions/billings/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export function InvoiceBtn({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (data) => {
      window.location.href = data as string;
    },
    onError: () => {
      toast.error("Something went wrong", { id: "invoice" });
    },
  });
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      disabled={mutation.isPending}
      onClick={() => mutation.mutate(id)}
      className="text-xs gap-2 text-muted-foreground px-1"
    >
      Invoice
      {mutation.isPending && <Loader2Icon className="h-4 w-4 animate-spin" />}
    </Button>
  );
}
