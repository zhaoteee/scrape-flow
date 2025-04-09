"use client";
import DeleteCredential from "@/actions/credentials/DeleteCredential";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string;
}

export default function DeleteCredentialDialog({ name }: Props) {
  const [confirmText, setConfirmText] = React.useState<string>("");
  const [open, setOpen] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: DeleteCredential,
    onSuccess: () => {
      toast.success("Credential deleted successfully", { id: name });
      setConfirmText("");
    },
    onError: () => {
      toast.error("Failed to delete credential", { id: name });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"}>
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this credential?
          </AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this credential, you will not be able to recover it.
            <span className="flex flex-col py-2 gap-2">
              <span>
                If you are sure, enter <b>{name}</b> to confirm:
              </span>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== name}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              toast.loading("Deleting workflow...", { id: name });
              deleteMutation.mutate(name);
              setOpen(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
