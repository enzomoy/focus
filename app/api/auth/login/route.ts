import { NextRequest, NextResponse } from "next/server"

import { AuthService, getAuthErrorMessage } from "@/lib/auth"
import { loginSchema } from "@/types/schemas/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const validatedData = loginSchema.parse(body)

    const user = await AuthService.login({
      email: validatedData.email,
      password: validatedData.password,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
    })
  } catch (error: unknown) {
    const firebaseError = error as {
      code?: string
      name?: string
      errors?: unknown[]
    }

    if (firebaseError.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides",
          details: firebaseError.errors,
        },
        { status: 400 }
      )
    }

    if (firebaseError.code) {
      return NextResponse.json(
        {
          success: false,
          error: getAuthErrorMessage(firebaseError.code),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne du serveur",
      },
      { status: 500 }
    )
  }
}
