import React from "react"
import mainHeaderImage from "./images/main.png"
import { LogOut } from "@styled-icons/boxicons-regular/LogOut"
import {Send} from '@styled-icons/material-twotone/Send'
const images = {
  mainHeaderImage,
}

const icons = {
  Logout: <LogOut />,
  Confirm: <Send />,
}

const theme = {
  header: {
    backgroundColor: `var(--color-primary)`,
    color: `var(--color-contrast)`,
  },

  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  colors: {
    blues: {
      0: "hsl(208, 13%, 100%)",
      1: "hsl(208, 13%, 95%)",
      2: "hsl(208, 13%, 85%)",
      3: "hsl(208, 13%, 75%)",
      4: "hsl(208, 13%, 65%)",
      5: "hsl(208, 13%, 55%)",
      6: "hsl(208, 13%, 45%)",
      7: "hsl(208, 13%, 35%)",
      8: "hsl(208, 13%, 25%)",
      9: "hsl(208, 13%, 15%)",
      10: "hsl(208, 13%, 5%)",
    },
  },
}

const variants = {
  iconButton: {
    primary: {
      color: theme.colors.blues[4],
    },
    contrast: {
      color: theme.colors.blues[0],
    },
  },
  header: {
    primary: {
      backgroundColor: theme.colors.blues[8],
      color: theme.colors.blues[0],
    },
  },
}

export const Baller = { ...theme, variants, images, icons }
