import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

// Create a Stripe account link for onboarding
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  })

  return accountLink.url
}

// Create a Stripe Connect account
export async function createConnectAccount(email: string, username: string) {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_profile: {
      name: username,
    },
    metadata: {
      username,
    },
  })

  return account.id
}

// Check if a Stripe account is fully onboarded
export async function isAccountOnboarded(accountId: string) {
  const account = await stripe.accounts.retrieve(accountId)

  return account.details_submitted && account.charges_enabled && account.payouts_enabled
}

// Create a payment intent for a tip
export async function createPaymentIntent(amount: number, accountId: string, metadata: any) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: "usd",
    application_fee_amount: Math.round(amount * 10), // 10% fee
    transfer_data: {
      destination: accountId,
    },
    metadata,
  })

  return paymentIntent
}

