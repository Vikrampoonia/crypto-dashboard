import { AppBar, Toolbar, Typography,IconButton , Button } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useCryptoStore } from "../store/cryptoStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { themeMode, toggleTheme } = useCryptoStore();

  return (
    <AppBar position="sticky" color="primary" enableColorOnDark>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Crypto Dashboard
        </Typography>
         <Button color="inherit" component={Link} to="/">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/favorites">
          Favorites
        </Button>
        <Button color="inherit" component={Link} to="/portfolio">
          Portfolio
        </Button>
        <Button color="inherit" component={Link} to="/account">
          Account
        </Button>
        <IconButton color="inherit" onClick={toggleTheme}>
          {themeMode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
