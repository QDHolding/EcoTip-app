"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { createTip } from "@/app/actions/tip-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TreePine, AlertCircle, Loader2 } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function TipForm({
  username,
  canReceiveTips,
}: {
  username: string
  canReceiveTips: boolean
}) {
  const [amount, setAmount] = useState(5)
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("amount", amount.toString())
    formData.append("message", message)
    formData.append("senderName", senderName)
    formData.append("senderEmail", senderEmail)
    formData.append("username", username)

    const result = await createTip(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.clientSecret) {
      setClientSecret(result.clientSecret)
    }
  }

  if (!canReceiveTips) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">This user hasn't set up payments yet</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {username} needs to complete their payment setup before they can receive tips
          </p>
        </CardContent>
      </Card>
    )
  }

  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm amount={amount} treesPlanted={Math.floor(amount)} />
      </Elements>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send a tip</CardTitle>
        <CardDescription>Support {username} and help plant trees</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-7"
                required
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TreePine className="h-3 w-3" />
              <span>Plants {Math.floor(amount)} trees</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderName">Your name (optional)</Label>
            <Input
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Anonymous"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderEmail">Your email (optional)</Label>
            <Input
              id="senderEmail"
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="For receipt"
            />
          </div>

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Send ${amount} tip</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function CheckoutForm({ amount, treesPlanted }: { amount: number; treesPlanted: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}/success`,
      },
      redirect: "if_required",
    })

    if (result.error) {
      setError(result.error.message || "Payment failed")
      setLoading(false)
    } else {
      setSucceeded(true)
    }
  }

  if (succeeded) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <TreePine className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Thank you for your tip!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your tip of ${amount} has been received and {treesPlanted} trees will be planted.
          </p>
          <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => router.refresh()}>
            Send another tip
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete your payment</CardTitle>
        <CardDescription>
          Your tip of ${amount} will plant {treesPlanted} trees
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <PaymentElement />

          {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading || !stripe || !elements}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Pay ${amount}</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

