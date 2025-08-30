import  { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import CryptoChart from "../components/CryptoChart";
import TradeModal from "../components/TradeModal";

const CoinDetails = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const [open, setOpen] = useState(false);

  if (!coinId) return null; // param missing

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {coinId}
        </Typography>

        <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpen(true)}>
          Trade {coinId}
        </Button>

        <CryptoChart coinId={coinId} days={30} />
      </Container>

      <TradeModal open={open} onClose={() => setOpen(false)} defaultCoinId={coinId} />
    </>
  );
};

export default CoinDetails;
