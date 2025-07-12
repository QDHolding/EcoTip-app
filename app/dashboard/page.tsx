import { redirect } from "next/navigation"
import Link from "next/link"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/copy-button"
import { Leaf, DollarSign, TreePine, AlertCircle } from "lucide-react"

export default async function DashboardPage() {
  const user = await requireAuth()

  // Get user's tips and impact data
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      treeImpact: true,
      tips: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: { tips: true },
      },
    },
  })

  if (!userData) {
    redirect("/login")
  }

  // Calculate total tips amount
  const totalTipsAmount = userData.tips.reduce((sum, tip) => sum + tip.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userData.name || userData.username}</p>
        </div>

        {!userData.stripeAccountConnected && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium text-orange-800">Connect your Stripe account</p>
                  <p className="text-sm text-orange-700">You need to connect Stripe to receive tips</p>
                  <Button asChild className="mt-2 bg-orange-500 hover:bg-orange-600">
                    <Link href="/dashboard/stripe">Set up payments</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">ecotip.com/{userData.username}</div>
              <CopyButton text={`${process.env.NEXT_PUBLIC_APP_URL}/${userData.username}`}>
                Copy
              </CopyButton>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div className="text-2xl font-bold">${totalTipsAmount.toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              From {userData._count.tips} {userData._count.tips === 1 ? "tip" : "tips"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trees Planted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold">{userData.treeImpact?.totalTreesPlanted || 0}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              {userData.treeImpact?.co2Offset.toFixed(2) || 0} tons of CO₂ offset
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tips</CardTitle>
          <CardDescription>Your most recent tips and support from followers</CardDescription>
        </CardHeader>
        <CardContent>
          {userData.tips.length > 0 ? (
            <div className="space-y-4">
              {userData.tips.map((tip) => (
                <div key={tip.id} className="flex items-start justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">{tip.senderName || "Anonymous"}</div>
                    <div className="text-sm text-muted-foreground">{new Date(tip.createdAt).toLocaleDateString()}</div>
                    {tip.message && <p className="mt-1 text-sm">{tip.message}</p>}
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${tip.amount.toFixed(2)}</div>
                    <div className="flex items-center justify-end gap-1 text-xs text-green-600">
                      <TreePine className="h-3 w-3" />
                      <span>{tip.treesPlanted} trees</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Leaf className="h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-medium">No tips yet</h3>
              <p className="text-sm text-muted-foreground">
                Share your link to start receiving tips and planting trees
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

