import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore"

import type { User as AppUser } from "@/types"
import type { AuthError, LoginData, RegisterData } from "@/types/auth"

import { auth, db } from "./firebase"

export class AuthService {
  static async register({
    email,
    password,
    displayName,
  }: RegisterData): Promise<AppUser> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password)

      const user = userCredential.user
      const userData: AppUser = {
        id: user.uid,
        email: user.email!,
        displayName: displayName,
        createdAt: Timestamp.now(),
      }

      await setDoc(doc(db, "users", user.uid), userData)

      return userData
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      throw {
        code: firebaseError.code || "unknown",
        message: firebaseError.message || "Une erreur est survenue",
      } as AuthError
    }
  }

  static async login({ email, password }: LoginData): Promise<AppUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        const userData: AppUser = {
          id: user.uid,
          email: user.email!,
          displayName: user.displayName || "Utilisateur",
          createdAt: Timestamp.now(),
        }
        await setDoc(doc(db, "users", user.uid), userData)
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
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string }
      throw {
        code: firebaseError.code || "unknown",
        message: firebaseError.message || "Une erreur est survenue",
      } as AuthError
    }
  }

  static async getCurrentUser(): Promise<AppUser | null> {
    const firebaseUser = auth.currentUser
    if (!firebaseUser) return null

    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))

      if (!userDoc.exists()) {
        const userData: AppUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || "Utilisateur",
          createdAt: Timestamp.now(),
        }
        await setDoc(doc(db, "users", firebaseUser.uid), userData)
        return userData
      }

      return userDoc.data() as AppUser
    } catch {
      return null
    }
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
      return "Erreur de connexion. Vérifiez votre connexion internet."
    default:
      return "Une erreur est survenue. Veuillez réessayer."
  }
}
