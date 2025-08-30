import { Container, Typography, Card, CardContent } from "@mui/material";
import Navbar from "../components/Navbar";
import { usePortfolioStore } from "../store/portfolioStore";

const Portfolio = () => {
  const holdings = usePortfolioStore((state) => state.holdings);
  const cash = usePortfolioStore((state) => state.cash);

  const holdingsArray = Object.values(holdings); // convert Record -> array

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Portfolio
        </Typography>

        {/* Show available cash */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">Cash Balance</Typography>
            <Typography>${cash.toLocaleString()}</Typography>
          </CardContent>
        </Card>

        {/* List holdings */}
        {holdingsArray.length === 0 ? (
          <Typography>No holdings yet. Start trading!</Typography>
        ) : (
          holdingsArray.map((h) => (
            <Card key={h.coinId} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{h.coinId}</Typography>
                <Typography>Amount: {h.amount}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Container>
    </>
  );
};

export default Portfolio;
