"use client"

import Link from "next/link"

import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export const dynamic = "force-dynamic"

function HomeContent() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <main className="mx-auto max-w-4xl">
        {/* Header avec statut auth */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Focus Timer</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">
                Connecté en tant que {user?.displayName || user?.email}
              </span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">Paramètres</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/stats">Statistiques</Link>
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Se déconnecter
            </Button>
          </div>
        </div>

        <p className="mb-8 text-center text-gray-600">
          Welcome to your productivity companion. Start focusing with our
          Pomodoro timer.
        </p>

        <div className="flex justify-center">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <p className="text-center">Timer component will go here</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <HomeContent />
    </AuthGuard>
  )
}
