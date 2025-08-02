"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth"

import { AuthService } from "@/lib/auth"
import { auth } from "@/lib/firebase"
import type { User as AppUser } from "@/types"

interface AuthContextType {
  user: AppUser | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        try {
          const appUser = await AuthService.getCurrentUser()
          setUser(appUser)
        } catch (error) {
          console.error("Error getting user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userData = await AuthService.login({ email, password })
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    try {
      const userData = await AuthService.register({
        email,
        password,
        displayName,
      })
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout()
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await AuthService.resetPassword({ email })
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
