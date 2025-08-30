import { Container, Typography, Button } from "@mui/material";
import { useAuthStore } from "../store/authStore";

const Account = () => {
  const { user, logout } = useAuthStore();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account
      </Typography>

      {user ? (
        <>
          <Typography>Email: {user.email}</Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={logout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </>
      ) : (
        <Typography>You are not logged in.</Typography>
      )}
    </Container>
  );
};

export default Account;
