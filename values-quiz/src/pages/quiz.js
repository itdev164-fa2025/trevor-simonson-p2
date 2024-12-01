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
      <p>
        Please respond to each question from 1-5. 1 meaning you
        strongly disagree, 5 meaning strongly agree.
      </p>
      <QuizForm />
    </Layout>
  )
}

export default Quiz
