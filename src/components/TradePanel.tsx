// src/components/TradePanel.tsx
import { useState } from "react";
import { usePortfolioStore } from "../store/portfolioStore";
import { sendTrade } from "../api/mockTradeApi";

interface Props {
  coinId: string;
}

export default function TradePanel({ coinId }: Props) {
  const { applyOptimisticTrade, applyExecutedTrade, markTradeFailed, cash } =
    usePortfolioStore();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    if (amount <= 0) return;
    setLoading(true);

    const price = Math.random() * 50000; // mock price
    const total = amount * price;

    if (side === "buy" && total > cash) {
      alert("Not enough cash!");
      setLoading(false);
      return;
    }

    const clientTradeId = crypto.randomUUID();
    // Create separate objects for optimistic UI update and API request
    const trade = {
      status: "pending" as const,
      tradeId: null,
      clientTradeId,
      coinId,
      side,
      amount,
      price,
      total,
    };

    const tradeRequest = {
      userId: "mock-user-id", // TODO: Replace with actual user ID from auth system
      coinId,
      side,
      amount,
      price,
      clientTradeId,
    };

    // Optimistic update
    applyOptimisticTrade(trade);

    try {
      const result = await sendTrade(tradeRequest);
      const executedTrade = {
        ...trade,
        status: "executed" as const,
        tradeId: result.tradeId,
        executedAt: result.executedAt,
      };
      applyExecutedTrade(executedTrade);
    } catch {
      markTradeFailed(clientTradeId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Side</label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as "buy" | "sell")}
          className="border rounded w-full p-2"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded w-full p-2"
        />
      </div>

      <button
        onClick={handleTrade}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          side === "buy" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {loading ? "Processing..." : side === "buy" ? "Buy" : "Sell"}
      </button>
    </div>
  );
}
