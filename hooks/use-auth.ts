"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 在客户端检查 localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken")
      setIsAuthenticated(!!token)
      setIsLoading(false)
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem("authToken", token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    setIsAuthenticated(false)
    router.push("/login")
  }

  const checkAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login")
      return false
    }
    return true
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  }
}
