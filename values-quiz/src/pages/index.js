import React, { useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import UserProfile from "../components/UserProfile/UserProfile"
import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = () => {
  console.log("AuthContext:", useContext(AuthContext))

  return (
    <Layout>
      <UserProfile />
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
