"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TreePine } from "lucide-react"

export default function SuccessPage({ params }: { params: { username: string } }) {
  const { username } = params
  const router = useRouter()

  // This would typically check the payment status via a query param
  // For simplicity, we're just showing a success message

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <TreePine className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Thank You!</h1>
          <p className="mt-2 text-muted-foreground">
            Your tip to {username} has been received and trees will be planted.
          </p>
          <div className="mt-6 space-y-2">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push(`/${username}`)}>
              Send another tip
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Learn more about EcoTip</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

