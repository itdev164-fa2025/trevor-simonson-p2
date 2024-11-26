import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { navigate } from "gatsby"
import Layout from "../components/layout"

const Login = () => {
  console.log("AuthContext:", useContext(AuthContext))
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate("/")
    } catch {
      alert("Login failed")
    }
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </Layout>
  )
}

export default Login
