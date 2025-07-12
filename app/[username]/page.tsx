import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import TipForm from "./tip-form"
import { Leaf, TreePine } from "lucide-react"

export async function generateMetadata({ params }: { params: { username: string } }) {
  const { username } = params

  const user = await prisma.user.findUnique({
    where: { username },
    select: { name: true },
  })

  if (!user) {
    return {
      title: "User not found",
    }
  }

  return {
    title: `Support ${user.name || username} | EcoTip`,
    description: `Send a tip to ${user.name || username} and help plant trees with EcoTip`,
  }
}

export default async function TipPage({ params }: { params: { username: string } }) {
  const { username } = params

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      treeImpact: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-lg font-bold">EcoTip</span>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        <div className="container max-w-lg px-4 py-8 md:py-12">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">{user.name || user.username}</h1>
            {user.bio && <p className="mt-2 text-muted-foreground">{user.bio}</p>}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
              <TreePine className="h-4 w-4" />
              <span>{user.treeImpact?.totalTreesPlanted || 0} trees planted so far</span>
            </div>
          </div>

          <TipForm username={username} canReceiveTips={user.stripeAccountConnected} />
        </div>
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container px-4 text-center text-sm text-muted-foreground md:px-6">
          <p>
            Powered by{" "}
            <a href="/" className="text-green-600 hover:underline">
              EcoTip
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

