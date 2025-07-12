"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { hashPassword, createSession } from "@/lib/auth"
import { createConnectAccount } from "@/lib/stripe"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8),
  name: z.string().optional(),
})

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const name = (formData.get("name") as string) || username

  try {
    // Validate input
    registerSchema.parse({ email, username, password, name })

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return { error: "Email already in use" }
      }
      return { error: "Username already taken" }
    }

    // Create Stripe Connect account
    const stripeAccountId = await createConnectAccount(email, username)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashPassword(password),
        stripeAccountId,
        treeImpact: {
          create: {
            totalTreesPlanted: 0,
            co2Offset: 0,
          },
        },
      },
    })

    // Create session
    await createSession(user.id)

    return { success: true, userId: user.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to register user" }
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Validate input
    loginSchema.parse({ email, password })

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || user.password !== hashPassword(password)) {
      return { error: "Invalid email or password" }
    }

    // Create session
    await createSession(user.id)

    return { success: true, userId: user.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: "Failed to log in" }
  }
}

export async function logoutUser() {
  cookies().delete("session_token")
  redirect("/login")
}

