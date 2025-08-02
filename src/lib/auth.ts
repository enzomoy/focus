import {
  UserCredential,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore"

import type { User as AppUser } from "@/types"
import type {
  AuthError,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from "@/types/auth"

import { auth, db } from "./firebase"

export class AuthService {
  static async register({
    email,
    password,
    displayName,
  }: RegisterData): Promise<AppUser> {
    if (!auth || !db) throw new Error("Firebase not initialized")

    return retryWithBackoff(async () => {
      try {
        const userCredential: UserCredential =
          await createUserWithEmailAndPassword(auth!, email, password)

        const user = userCredential.user
        const userData: AppUser = {
          id: user.uid,
          email: user.email!,
          displayName: displayName,
          createdAt: Timestamp.now(),
        }

        await setDoc(doc(db!, "users", user.uid), userData)

        return userData
      } catch (error: unknown) {
        const firebaseError = error as { code?: string; message?: string }
        throw {
          code: firebaseError.code || "unknown",
          message: firebaseError.message || "Une erreur est survenue",
        } as AuthError
      }
    })
  }

  static async login({ email, password }: LoginData): Promise<AppUser> {
    if (!auth || !db) throw new Error("Firebase not initialized")

    return retryWithBackoff(async () => {
      try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(
          auth!,
          email,
          password
        )

        const user = userCredential.user
        const userDoc = await getDoc(doc(db!, "users", user.uid))

        if (!userDoc.exists()) {
          const userData: AppUser = {
            id: user.uid,
            email: user.email!,
            displayName: user.displayName || "Utilisateur",
            createdAt: Timestamp.now(),
          }
          await setDoc(doc(db!, "users", user.uid), userData)
          return userData
        }

        return userDoc.data() as AppUser
      } catch (error: unknown) {
        const firebaseError = error as { code?: string; message?: string }
        throw {
          code: firebaseError.code || "unknown",
          message: firebaseError.message || "Une erreur est survenue",
        } as AuthError
      }
    })
  }

  static async logout(): Promise<void> {
    if (!auth) throw new Error("Firebase not initialized")

    try {
      await signOut(auth!)
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      throw {
        code: firebaseError.code || "unknown",
        message: firebaseError.message || "Une erreur est survenue",
      } as AuthError
    }
  }

  static async getCurrentUser(): Promise<AppUser | null> {
    if (!auth || !db) return null
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return null

    try {
      const userDoc = await getDoc(doc(db!, "users", firebaseUser.uid))

      if (!userDoc.exists()) {
        const userData: AppUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || "Utilisateur",
          createdAt: Timestamp.now(),
        }
        await setDoc(doc(db!, "users", firebaseUser.uid), userData)
        return userData
      }

      return userDoc.data() as AppUser
    } catch {
      return null
    }
  }

  static async resetPassword({ email }: ResetPasswordData): Promise<void> {
    if (!auth) throw new Error("Firebase not initialized")

    return retryWithBackoff(async () => {
      try {
        await sendPasswordResetEmail(auth!, email)
      } catch (error: unknown) {
        const firebaseError = error as { code?: string; message?: string }
        throw {
          code: firebaseError.code || "unknown",
          message: firebaseError.message || "Une erreur est survenue",
        } as AuthError
      }
    })
  }
}

export const getAuthErrorMessage = (code: string): string => {
  switch (code) {
    case "auth/user-not-found":
      return "Aucun utilisateur trouvé avec cette adresse email."
    case "auth/wrong-password":
      return "Mot de passe incorrect."
    case "auth/email-already-in-use":
      return "Cette adresse email est déjà utilisée."
    case "auth/weak-password":
      return "Le mot de passe doit contenir au moins 6 caractères."
    case "auth/invalid-email":
      return "Adresse email invalide."
    case "auth/too-many-requests":
      return "Trop de tentatives. Veuillez réessayer plus tard."
    case "auth/network-request-failed":
      return "Erreur de connexion. Vérifiez votre connexion internet et réessayez."
    case "auth/timeout":
      return "La demande a expiré. Vérifiez votre connexion et réessayez."
    case "auth/invalid-credential":
      return "Identifiants invalides. Vérifiez votre email et mot de passe."
    case "auth/user-disabled":
      return "Ce compte a été désactivé. Contactez le support."
    case "auth/operation-not-allowed":
      return "Cette opération n'est pas autorisée."
    default:
      return "Une erreur est survenue. Vérifiez votre connexion et réessayez."
  }
}

export const isNetworkError = (error: unknown): boolean => {
  const networkErrorCodes = [
    "auth/network-request-failed",
    "auth/timeout",
    "network-request-failed",
    "timeout",
  ]

  const err = error as { code?: string; message?: string }

  return networkErrorCodes.some(
    (code) =>
      err?.code?.includes(code) ||
      err?.message?.toLowerCase().includes("network") ||
      err?.message?.toLowerCase().includes("timeout") ||
      err?.message?.toLowerCase().includes("connexion")
  )
}

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (!isNetworkError(error) || i === maxRetries) {
        throw error
      }

      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      )
    }
  }

  throw lastError
}
