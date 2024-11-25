

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from "styled-components"


import { Header } from "./Header"
import "./layout.css"
import { Gray } from './themes/Gray'
import { Main } from './Main'
import { Footer } from './Footer'

const Content = styled.div`
  margin: 0 auto;
  max-width: var(--size-content);
  padding: var(--size-gutter);
`

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <ThemeProvider theme={Gray}>
      <Header />
      <Content>
        <Main m={20}>{children}</Main>
      </Content>
    </ThemeProvider>
  )
}

export default Layout
