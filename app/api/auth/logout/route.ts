import { NextResponse } from "next/server"

import { AuthService, getAuthErrorMessage } from "@/lib/auth"

export async function POST() {
  try {
    await AuthService.logout()

    return NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    })
  } catch (error: unknown) {
    const firebaseError = error as { code?: string }

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
