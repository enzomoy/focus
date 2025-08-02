"use client"

import { AuthGuard } from "@/components/auth/auth-guard"

function StatsContent() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Statistiques</h1>

        <div className="rounded-lg border p-6">
          <p className="text-gray-600">
            Vos statistiques de productivité apparaîtront ici.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function StatsPage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <StatsContent />
    </AuthGuard>
  )
}
