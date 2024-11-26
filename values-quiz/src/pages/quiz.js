import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import QuizForm from "../components/QuizForm/QuizForm"
import { navigate } from "gatsby"
import Layout from "../components/layout"

const Quiz = () => {
  console.log("AuthContext:", useContext(AuthContext))
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <p>Loading...</p>
  }
  return (
    <Layout>
      <h1>{user.name}</h1>
      <QuizForm />
    </Layout>
  )
}

export default Quiz
