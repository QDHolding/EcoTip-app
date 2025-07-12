import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { completeTip } from "@/app/actions/tip-actions"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string)

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object
        await completeTip(paymentIntent.id)
        break

      case "account.updated":
        const account = event.data.object
        if (account.details_submitted && account.charges_enabled && account.payouts_enabled) {
          await prisma.user.updateMany({
            where: { stripeAccountId: account.id },
            data: { stripeAccountConnected: true },
          })
        }
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}

