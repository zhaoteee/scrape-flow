"use client";

import React, { useCallback } from "react";
import { Layers2Icon, Loader2, ShieldEllipsis } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCredentialSchema,
  CreateCredentialSchema,
} from "@/schema/credential";
import CreateCredential from "@/actions/credentials/CreateCredential";

export default function CreateCredentialDialog({
  triggerText,
}: {
  triggerText?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<CreateCredentialSchema>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success("Credential created successfully", {
        id: "create-credential",
      });
    },
    onError: () => {
      toast.error("Failed to create credential", { id: "create-credential" });
    },
  });
  const onSubmit = useCallback(
    (values: CreateCredentialSchema) => {
      toast.loading("Creating credential...", { id: "create-credential" });
      mutate(values);
      setOpen(false);
    },
    [mutate]
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={ShieldEllipsis}
          title="Create credential"
          subTitle="Start building your credential"
        ></CustomDialogHeader>
        <div className="p-6 pt-0">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique an descriptive name for the credential{" "}
                      <br />
                      This name will be user to identify the credential
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Value
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter this value associated with this credential <br />
                      This value will be securely encrypted and stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Proceed"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
