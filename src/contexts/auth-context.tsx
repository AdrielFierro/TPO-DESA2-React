"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("restaurant-user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        document.cookie = `restaurant-user=${storedUser}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem("restaurant-user")
        document.cookie = "restaurant-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
    }
    setIsLoading(false)
  }, [])

  const login = (user: User) => {
    setUser(user)
    const userString = JSON.stringify(user)
    localStorage.setItem("restaurant-user", userString)
    document.cookie = `restaurant-user=${userString}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("restaurant-user")
    document.cookie = "restaurant-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
