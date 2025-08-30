import { Container, Typography, Card, CardContent } from "@mui/material";

const Portfolio = () => {
  // mock holdings
  const holdings = [
    { id: "bitcoin", name: "Bitcoin", amount: 0.5, value: 30000 },
    { id: "ethereum", name: "Ethereum", amount: 2, value: 4000 },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>
      {holdings.map((h) => (
        <Card key={h.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{h.name}</Typography>
            <Typography>Amount: {h.amount}</Typography>
            <Typography>Value: ${h.value.toLocaleString()}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Portfolio;
