"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

function SettingsContent() {
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
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Paramètres</h1>

        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Profil</h2>
            <div className="space-y-2">
              <p>
                <strong>Nom :</strong> {user?.displayName}
              </p>
              <p>
                <strong>Email :</strong> {user?.email}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Compte</h2>
            <Button onClick={handleLogout} variant="destructive">
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <SettingsContent />
    </AuthGuard>
  )
}
