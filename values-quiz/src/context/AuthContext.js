import * as React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
    })
    localStorage.setItem("token", response.data.token)
    console.log(response.data)
    setUser({
      id: response.data.user.id,
      name: response.data.user.name,
      email: response.data.user.email,
    })
  }

  const register = async (name, email, password) => {
    await axios.post("http://localhost:5000/api/register", {
      name,
      email,
      password,
    })
  }

  const logout = () => {
    console.log("logout called")
    localStorage.removeItem("token")
    setUser(null)
  }

  const verifyToken = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/protected",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        console.log("Token verified successfully:", response.data)
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
        })
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyToken()
    console.log("Logged in user:", user)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
