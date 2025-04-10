"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

export async function DownloadInvoice(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthenticated");
  const puchase = await prisma.userPurchase.findUnique({
    where: { id, userId },
  });
  if (!puchase) {
    throw new Error("bad requerst");
  }
  const session = await stripe.checkout.sessions.retrieve(puchase.stripeId);
  if (!session.invoice) {
    throw new Error("invoice not found");
  }
  const invoice = await stripe.invoices.retrieve(session.invoice as string);
  return invoice.hosted_invoice_url;
}
