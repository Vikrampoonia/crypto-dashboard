import  { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material";
import { useCryptos } from "../api/useCryptos";
import { useTrade } from "../hooks/useTrade";
import { usePortfolioStore } from "../store/portfolioStore";

export default function TradeModal({ open, onClose, defaultCoinId }: { open: boolean; onClose: () => void; defaultCoinId?: string }) {
  const { data: cryptos } = useCryptos();
  const trade = useTrade();
  const cash = usePortfolioStore((s) => s.cash);

  const [coinId, setCoinId] = useState<string>(defaultCoinId ?? cryptos?.[0]?.id ?? "");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<number>(0);

  // find price from list if exists
  const current = cryptos?.find((c: any) => c.id === coinId);
  const price = current ? current.current_price : 0;

  const handleSubmit = () => {
    if (!coinId || amount <= 0) return alert("Invalid trade");
    if (side === "buy" && amount * price > cash) return alert("Insufficient cash");

    trade.mutate({
      userId: "local_user",
      coinId,
      side,
      amount,
      price,
    });

    onClose();
    // reset
    setAmount(0);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Place Order</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 320 }}>
          <TextField select label="Coin" value={coinId} onChange={(e) => setCoinId(e.target.value)}>
            {cryptos?.map((c: any) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name} ({c.symbol})
              </MenuItem>
            ))}
          </TextField>

          <TextField select label="Side" value={side} onChange={(e: any) => setSide(e.target.value)}>
            <MenuItem value="buy">Buy</MenuItem>
            <MenuItem value="sell">Sell</MenuItem>
          </TextField>

          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            helperText={`Price: $${Number(price).toFixed(2)} — Total: $${(amount * price).toFixed(2)}`}
          />

          <Typography>Cash Balance: ${cash.toLocaleString()}</Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Place Order
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
