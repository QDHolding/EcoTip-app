"use server"

import { prisma } from "@/lib/prisma"
import { createPaymentIntent } from "@/lib/stripe"
import { z } from "zod"

const tipSchema = z.object({
  amount: z.number().min(1),
  message: z.string().optional(),
  senderName: z.string().optional(),
  senderEmail: z.string().email().optional(),
  username: z.string(),
})

export async function createTip(formData: FormData) {
  const amount = Number(formData.get("amount"))
  const message = (formData.get("message") as string) || undefined
  const senderName = (formData.get("senderName") as string) || undefined
  const senderEmail = (formData.get("senderEmail") as string) || undefined
  const username = formData.get("username") as string

  try {
    // Validate input
    tipSchema.parse({ amount, message, senderName, senderEmail, username })

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return { error: "User not found" }
    }

    if (!user.stripeAccountId || !user.stripeAccountConnected) {
      return { error: "User has not set up payments yet" }
    }

    // Calculate trees to plant (1 tree per $1)
    const treesPlanted = Math.floor(amount)

    // Create payment intent
    const paymentIntent = await createPaymentIntent(amount, user.stripeAccountId, {
      username: user.username,
      treesPlanted: treesPlanted.toString(),
      tipType: "standard",
    })

    // Create tip record (will be updated when payment is completed)
    const tip = await prisma.tip.create({
      data: {
        amount,
        message,
        senderName,
        senderEmail,
        treesPlanted,
        stripePaymentId: paymentIntent.id,
        userId: user.id,
      },
    })

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      tipId: tip.id,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Error creating tip:", error)
    return { error: "Failed to process tip" }
  }
}

// This would be called by a webhook when payment is completed
export async function completeTip(paymentIntentId: string) {
  try {
    // Find the tip by payment intent ID
    const tip = await prisma.tip.findFirst({
      where: { stripePaymentId: paymentIntentId },
      include: { user: true },
    })

    if (!tip) {
      return { error: "Tip not found" }
    }

    // Update tree impact
    await prisma.treeImpact.update({
      where: { userId: tip.userId },
      data: {
        totalTreesPlanted: { increment: tip.treesPlanted },
        co2Offset: { increment: tip.treesPlanted * 0.06 }, // Approx. 0.06 tons CO2 per tree over 10 years
        updatedAt: new Date(),
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error completing tip:", error)
    return { error: "Failed to complete tip" }
  }
}

