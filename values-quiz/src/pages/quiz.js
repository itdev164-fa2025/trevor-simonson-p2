import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import QuizForm from "../components/QuizForm/QuizForm"
import { navigate } from "gatsby"

const Quiz = () => {
  console.log("AuthContext:", useContext(AuthContext))
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <p>Loading...</p>
  }
  return (
    <>
      <h1>{user.id}</h1>
      <QuizForm />
    </>
  )
}

export default Quiz
