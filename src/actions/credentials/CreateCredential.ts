"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  CreateCredentialSchema,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function CreateCredential(form: CreateCredentialSchema) {
  const { success, data } = createCredentialSchema.safeParse(form);
  if (!success) {
    throw new Error("iinvalid form data");
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }
  const encryptedValue = symmetricEncrypt(data.value);
  console.log("test", {
    plain: data.value,
    jm: encryptedValue,
  });
  const resut = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  });
  revalidatePath("/credentials");
}
