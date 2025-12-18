import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("authToken")
    if (token) {
      // In a real app, validate token with backend
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    // All logins via backend
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message)

    localStorage.setItem("authToken", "backend-token")
    localStorage.setItem("user", JSON.stringify(data.user))
    setUser(data.user)
  }

  const signup = async (data) => {
    // Backend signup
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message)

    // After signup, automatically login the user
    const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })

    const loginData = await loginResponse.json()
    if (!loginResponse.ok) throw new Error(loginData.message)

    localStorage.setItem("authToken", "backend-token")
    localStorage.setItem("user", JSON.stringify(loginData.user))
    setUser(loginData.user)
  }

  const googleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google?state=login"
  }

  const googleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google?state=signup"
  }

  const checkGoogleAuth = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include"
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("authToken", "google-token")
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        return true
      }
    } catch (error) {
      console.error("Google auth check failed:", error)
    }
    return false
  }

  const setPasswordForGoogleUser = async (userId, password) => {
    const response = await fetch("http://localhost:5000/api/auth/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message)

    localStorage.setItem("authToken", "google-token")
    localStorage.setItem("user", JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, signup, googleLogin, googleSignup, setPasswordForGoogleUser, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
