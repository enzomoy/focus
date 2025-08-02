"use client"

import { useState } from "react"

import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { getAuthErrorMessage } from "@/lib/auth"
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from "@/types/schemas/auth"

type ResetPasswordFormValues = ResetPasswordFormData

function ForgotPasswordForm() {
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setIsLoading(true)
      setError("")
      setSuccess("")

      await resetPassword(values.email)
      setSuccess(
        "Un email de réinitialisation a été envoyé à votre adresse email."
      )
    } catch (error: unknown) {
      const firebaseError = error as { code?: string }
      setError(
        firebaseError.code
          ? getAuthErrorMessage(firebaseError.code)
          : "Une erreur est survenue"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <Form {...form}>
          <form
            className="mt-8 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Adresse email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                        placeholder="Votre email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-green-600">
                {success}
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              >
                {isLoading ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Retour à la connexion
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <ForgotPasswordForm />
    </AuthGuard>
  )
}
