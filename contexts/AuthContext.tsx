'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  email: string
  name: string
  avatar?: string
  loginTime: string
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Check for existing user session on mount
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      }
    } catch (error) {
      console.error('Error loading user session:', error)
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: User) => {
    try {
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Error saving user session:', error)
    }
  }

  const logout = () => {
    try {
      setUser(null)
      localStorage.removeItem('user')
    } catch (error) {
      console.error('Error clearing user session:', error)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return default values instead of throwing error to prevent white screen
    return {
      user: null,
      login: () => {},
      logout: () => {},
      isLoading: false
    }
  }
  return context
}
