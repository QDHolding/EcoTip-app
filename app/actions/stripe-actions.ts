"use server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { createAccountLink, isAccountOnboarded } from "@/lib/stripe"

export async function setupStripeAccount() {
  const user = await requireAuth()

  if (!user.stripeAccountId) {
    return { error: "Stripe account not found" }
  }

  try {
    const accountLink = await createAccountLink(
      user.stripeAccountId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stripe?refresh=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stripe?success=true`,
    )

    return { url: accountLink }
  } catch (error) {
    console.error("Error creating account link:", error)
    return { error: "Failed to create Stripe onboarding link" }
  }
}

export async function checkStripeAccountStatus() {
  const user = await requireAuth()

  if (!user.stripeAccountId) {
    return { connected: false }
  }

  try {
    const isConnected = await isAccountOnboarded(user.stripeAccountId)

    if (isConnected && !user.stripeAccountConnected) {
      // Update user record if account is now connected
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeAccountConnected: true },
      })
    }

    return { connected: isConnected }
  } catch (error) {
    console.error("Error checking account status:", error)
    return { error: "Failed to check Stripe account status" }
  }
}

