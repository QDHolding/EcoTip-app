import { cookies } from "next/headers"
import { createHash } from "crypto"
import { prisma } from "./prisma"
import { redirect } from "next/navigation"

// Password hashing
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Create a session for a user
export async function createSession(userId: string) {
  const sessionToken = crypto.randomUUID()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  cookies().set("session_token", sessionToken, {
    expires,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  })

  await prisma.session.create({
    data: {
      sessionToken,
      userId,
      expires,
    },
  })
}

// Get the current user from the session
export async function getCurrentUser() {
  const sessionToken = cookies().get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: {
      sessionToken,
    },
    include: {
      user: true,
    },
  })

  if (!session || session.expires < new Date()) {
    return null
  }

  return session.user
}

// Require authentication
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

