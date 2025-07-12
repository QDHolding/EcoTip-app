import type React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Leaf, LayoutDashboard, CreditCard, BarChart, Settings, LogOut } from "lucide-react"
import { logoutUser } from "@/app/actions/auth-actions"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold">EcoTip</span>
          </div>
          <form action={logoutUser}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </form>
        </div>
      </header>

      <div className="container flex-1 items-start px-4 py-6 md:grid md:grid-cols-[220px_1fr] md:gap-6 md:px-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard/stripe">
                <CreditCard className="mr-2 h-4 w-4" />
                Payments
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard/analytics">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </aside>
        <main className="w-full">{children}</main>
      </div>
    </div>
  )
}

