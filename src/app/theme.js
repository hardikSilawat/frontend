"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,

  typography: {
    fontFamily: '"Lora", serif',
    allVariants: {
      fontFamily: '"Lora", serif',
    },
  },
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3cb815",
      dark: "#002884",
      contrastText: "#fff",
      lightHover: "#ff7800",
    },
    secondary: {
      main: "#ff0000",
    },
    bglightorange: "#F9F4EE ", //  light grayish-orange background color
    bglightorange10: "#f9ebdb ", //  light grayish-orange background color
    bgSpringGreen: "#F0F3E8",
    bggray200: "#F5F5F5",

    gray70: "#323B3E",
    gray40: "#666666",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&.MuiButton-containedPrimary:hover": {
            backgroundColor: "#ff7800",
          },
          "&.MuiButton-containedSecondary:hover": {
            backgroundColor: "#ff7800",
          },
        },
      },
    },
  },
});

export default theme;
