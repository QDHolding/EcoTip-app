"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setupStripeAccount, checkStripeAccountStatus } from "@/app/actions/stripe-actions"
import { CreditCard, CheckCircle, ArrowRight, Loader2 } from "lucide-react"

export default function StripeSetupPage() {
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user is coming back from Stripe onboarding
  const refresh = searchParams.get("refresh") === "true"
  const success = searchParams.get("success") === "true"

  useEffect(() => {
    async function checkStatus() {
      setLoading(true)
      const result = await checkStripeAccountStatus()

      if (result.error) {
        setError(result.error)
      } else {
        setConnected(result.connected)
      }

      setLoading(false)
    }

    checkStatus()
  }, [refresh, success])

  async function handleConnect() {
    setConnecting(true)
    setError(null)

    const result = await setupStripeAccount()

    if (result.error) {
      setError(result.error)
      setConnecting(false)
    } else if (result.url) {
      window.location.href = result.url
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Setup</h1>
        <p className="text-muted-foreground">Connect your Stripe account to receive tips</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect</CardTitle>
          <CardDescription>
            EcoTip uses Stripe to securely process payments and send money directly to your bank account while tracking
            environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connected ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Stripe account connected</h3>
              <p className="mt-1 text-sm text-muted-foreground">Your account is set up and ready to receive tips</p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => router.push("/dashboard")}>
                Return to dashboard
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Connect your Stripe account</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You'll be redirected to Stripe to complete the setup process
              </p>

              {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

              <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleConnect} disabled={connecting}>
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect with Stripe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

