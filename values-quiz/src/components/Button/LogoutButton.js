import React from "react"
import PropTypes from "prop-types"
import { ThemeConsumer } from "styled-components"
import { IconButton } from "./IconButton"

export const LogoutButton = props => (
  <ThemeConsumer>
    {theme => <IconButton icon={theme.icons.Logout} {...props} />}
  </ThemeConsumer>
)

LogoutButton.propTypes = {
  variant: PropTypes.string,
}
