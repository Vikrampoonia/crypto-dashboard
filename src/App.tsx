import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useCryptoStore } from "./store/cryptoStore";
import { getTheme } from "./theme/theme";
import Favorites from "./pages/Favourites";
import Portfolio from "./pages/Portfolio";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


function App() {
  const themeMode = useCryptoStore((state) => state.themeMode);
  const theme = getTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
