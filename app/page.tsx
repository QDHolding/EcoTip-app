import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Users, CreditCard, TreePine } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold">EcoTip</span>
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">Beta</span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#impact" className="text-sm font-medium hover:underline underline-offset-4">
              Impact
            </Link>
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-green-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-green-100 p-1 mb-4">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  EcoTip helps your business or social media channel accept support from customers or followers while
                  planting trees.
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Monetize by receiving support while planting trees. Make a positive impact with every tip you receive.
                </p>
                <div className="mt-8 bg-orange-50 rounded-xl p-6 border border-orange-100">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <div className="flex items-center border rounded-lg bg-white overflow-hidden">
                        <span className="px-3 py-2 bg-gray-50 text-gray-500 border-r">ecotip.com/</span>
                        <Input
                          type="text"
                          placeholder="your name"
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
              <div className="relative lg:order-last">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="EcoTip illustration showing a person receiving tips while planting trees"
                  className="mx-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our tipping bot makes it easy to accept support while making a positive environmental impact.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Create Your Link</h3>
                <p className="text-muted-foreground">
                  Set up your personalized tipping page in minutes and share it with your audience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Receive Tips</h3>
                <p className="text-muted-foreground">
                  Your supporters can easily send you tips through your personalized link.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <TreePine className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Plant Trees</h3>
                <p className="text-muted-foreground">
                  A portion of every tip goes toward planting trees, creating a positive environmental impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Make a Real Environmental Impact
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Every tip plants trees. Track your environmental impact and share it with your community.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    <span>Each $1 tip plants a tree</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    <span>Track your total trees planted</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    <span>Share your impact with your audience</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600"></div>
                    <span>Receive impact certificates</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Start Your Impact
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <span className="font-semibold">Your Impact</span>
                    </div>
                    <span className="text-sm text-muted-foreground">@yourname</span>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <div className="text-5xl font-bold text-green-600">127</div>
                      <div className="text-sm text-muted-foreground mt-1">Trees Planted</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="rounded-lg bg-green-50 p-3">
                        <div className="text-xl font-bold">1.2</div>
                        <div className="text-xs text-muted-foreground">Tons of CO₂</div>
                      </div>
                      <div className="rounded-lg bg-green-50 p-3">
                        <div className="text-xl font-bold">3.8</div>
                        <div className="text-xs text-muted-foreground">Years of Oxygen</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Create your personalized tipping link and start making an impact today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex items-center border rounded-lg bg-white overflow-hidden">
                  <span className="px-3 py-2 bg-gray-50 text-gray-500 border-r">ecotip.com/</span>
                  <Input
                    type="text"
                    placeholder="your name"
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">Create Your Link</Button>
                <p className="text-xs text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="underline underline-offset-2">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold">EcoTip</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EcoTip. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

