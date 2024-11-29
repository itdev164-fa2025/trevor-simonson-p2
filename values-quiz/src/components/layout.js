import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useStaticQuery, graphql } from "gatsby"
import AuthProvider from "../context/AuthContext"
import "./layout.css"
import Header from './Header/Header'
import styled, { ThemeProvider } from "styled-components"
import { Baller } from "./themes/Baller"


const Content = styled.div`
    margin: 0 auto;
    max-width: var(--size-content);
    padding: var(--size-gutter);
  `
const Layout = ({ children }) => {
  const { loading } = useContext(AuthContext); 

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  

  if (loading) {
    return (
      <div>
        <p>Loading...</p> 
      </div>
    );
  }


  return (
      <AuthProvider>
        <ThemeProvider theme={Baller}>
          <Content>
            <Header />
            <main>{children}</main>
          </Content>
        </ThemeProvider>
      </AuthProvider>

  )
}

export default Layout
