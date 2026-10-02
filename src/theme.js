import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2D6A4F",
      light: "#52B788",
      dark: "#1B4332",
    },
    secondary: {
      main: "#2D6A4F",
      light: "#40916C",
      dark: "#1B4332",
    },
    background: {
      default: "#F7F4EC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1B2A22",
      secondary: "#5C6B63",
    },
  },
  typography: {
    fontFamily:
      '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export { theme };
