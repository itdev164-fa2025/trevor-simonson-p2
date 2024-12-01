import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import {Flex, Box} from 'rebass'
import styled from "styled-components"

const StyledForm = styled.form`
  margin: auto;
  padding: 2rem;
  align-items: center;
  justify-content: center;
  max-width: 300px;
`



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
      <StyledForm onSubmit={handleSubmit}>
        <Flex flexDirection={"column"}>
          <Box
            as="input"
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
          <Box
            as="input"
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </Flex>
      </StyledForm>
    </Layout>
  )
}

export default Login
