"use server";

import prisma from "@/lib/prisma";
import { CreateWorkflowSchema, createWorkflowSchema } from "@/schema/workflow";
import { WorkflowStaus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreateWorkflow(form: CreateWorkflowSchema) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const workflow = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStaus.DRAFT,
      defintion: "{}",
      ...data,
    },
  });
  if (!workflow) {
    throw new Error("Failed to create workflow");
  }
  redirect(`/workflow/editor/${workflow.id}`); // Redirect to the workflow page
}
