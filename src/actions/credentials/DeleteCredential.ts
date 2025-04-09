"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  CreateCredentialSchema,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function DeleteCredential(name: string) {
  if (!name) {
    throw new Error("name is needed");
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }
  await prisma.credential.delete({
    where: {
      userId_name: {
        userId,
        name: name,
      },
    },
  });
  revalidatePath("/credentials");
}
