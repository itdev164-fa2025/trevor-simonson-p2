import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { navigate } from "@reach/router"
import Layout from "../components/layout"

const Register = () => {
  console.log("AuthContext:", useContext(AuthContext))
  const { register } = useContext(AuthContext)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await register(name, email, password)
      navigate("/")
    } catch {
      alert("Registration failed")
    }
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          onChange={e => setName(e.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>
    </Layout>
  )
}

export default Register
