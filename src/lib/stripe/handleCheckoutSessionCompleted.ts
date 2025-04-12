import { getCreditsPack, PackId } from "@/types/billing";
import { writeFile } from "fs";
import "server-only";
import Stripe from "stripe";
import prisma from "../prisma";

export async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  //   writeFile("session_completed.json", JSON.stringify(event), (err) => {});
  if (!event.metadata) {
    throw new Error("missing metadata");
  }
  const { userId, packId } = event.metadata;
  if (!userId) {
    throw new Error("missing userId");
  }
  if (!packId) {
    throw new Error("missing packId");
  }
  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) {
    throw new Error("purchased pack not found");
  }
  console.log(userId, purchasedPack.credits);
  try {
    await prisma.userBalance.upsert({
      where: { userId },
      create: {
        userId,
        credits: purchasedPack.credits,
      },
      update: {
        credits: {
          increment: purchasedPack.credits,
        },
      },
    });
    await prisma.userPurchase.create({
      data: {
        userId,
        stripeId: event.id,
        description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
        amount: event.amount_subtotal!,
        currency: event.currency!,
      },
    });
    console.log("after userBalance.upsert");
  } catch (error) {
    console.log("add userBalance.upsert error", error);
  }
}
