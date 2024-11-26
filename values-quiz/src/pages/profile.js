import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import UserProfile from "../components/UserProfile/UserProfile"
import Layout from "../components/layout"


const Profile = () => {
  console.log("AuthContext:", useContext(AuthContext))

  return (
    <Layout>
      <UserProfile />
    </Layout>
  )
}


export default Profile
