import React from "react"
import PropTypes from "prop-types"
import { ThemeConsumer } from "styled-components"
import { IconButton } from "./IconButton"

export const ConfirmButton = props => (
  <ThemeConsumer>
    {theme => <IconButton icon={theme.icons.Confirm} {...props} />}
  </ThemeConsumer>
)

ConfirmButton.propTypes = {
  variant: PropTypes.string,
}
