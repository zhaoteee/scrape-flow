import { HandleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature") as string;
  console.log(signature);
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("event.type", event.type);
    switch (event.type) {
      case "checkout.session.completed":
        // 部署到Vercel 要使用await  Vercel会清理执行环境导致异步任务无法执行,充值就会失败
        await HandleCheckoutSessionCompleted(event.data.object);
        break;

      default:
        break;
    }
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log("stripe webhook error", error);
    return new NextResponse("webhook error", { status: 400 });
  }
}
