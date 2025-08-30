import { create} from "zustand";
import type {StateCreator } from "zustand";

interface Trade {
  status: "pending" | "executed" | "failed";
  tradeId: string | null;
  clientTradeId: string;
  coinId: string;
  side: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
  executedAt?: string | null;
}

interface Holding {
  coinId: string;
  amount: number;
}

interface PortfolioState {
  holdings: Record<string, Holding>;
  cash: number;
  trades: Trade[];
  applyExecutedTrade: (trade: Trade) => void;
  applyOptimisticTrade: (trade: Trade) => void;
  markTradeFailed: (clientTradeId: string) => void;
  removePending: (clientTradeId: string) => void;
  updateCash: (amount: number) => void;
}

// Use StateCreator to strongly type the store
const portfolioStore: StateCreator<PortfolioState> = (set) => ({
  holdings: {}, // { bitcoin: { coinId:'bitcoin', amount: 0.5 } }
  cash: 100000, // mock USD
  trades: [],

  applyExecutedTrade: (trade) =>
    set((s): Partial<PortfolioState> => {
      const trades = s.trades.map((t) =>
        t.clientTradeId === trade.clientTradeId
          ? { ...t, ...trade, status: "executed" as const }
          : t
      );

      const h = { ...s.holdings };
      const prevAmount = h[trade.coinId]?.amount ?? 0;
      h[trade.coinId] = {
        coinId: trade.coinId,
        amount:
          trade.side === "buy"
            ? prevAmount + trade.amount
            : prevAmount - trade.amount,
      };

      return {
        holdings: h,
        cash: s.cash - (trade.side === "buy" ? trade.total : -trade.total),
        trades,
      };
    }),

  applyOptimisticTrade: (t) =>
    set((s): Partial<PortfolioState> => {
      const tradeWithStatus = { ...t, status: "pending" as const };
      const trades = [tradeWithStatus, ...s.trades];
      const h = { ...s.holdings };
      const prevAmount = h[t.coinId]?.amount ?? 0;

      h[t.coinId] = {
        coinId: t.coinId,
        amount: t.side === "buy" ? prevAmount + t.amount : prevAmount - t.amount,
      };

      return {
        holdings: h,
        cash: s.cash - (t.side === "buy" ? t.total : -t.total),
        trades,
      };
    }),

  markTradeFailed: (clientTradeId) =>
    set((s): Partial<PortfolioState> => {
      const trades = s.trades.map((t) =>
        t.clientTradeId === clientTradeId ? { ...t, status: "failed" as const } : t
      );

      const failed = s.trades.find((t) => t.clientTradeId === clientTradeId);
      if (!failed) return { trades };

      const h = { ...s.holdings };
      const prevAmount = h[failed.coinId]?.amount ?? 0;
      h[failed.coinId] = {
        coinId: failed.coinId,
        amount:
          failed.side === "buy"
            ? prevAmount - failed.amount
            : prevAmount + failed.amount,
      };

      return {
        holdings: h,
        cash: s.cash + (failed.side === "buy" ? failed.total : -failed.total),
        trades,
      };
    }),

  removePending: (clientTradeId) =>
    set((s): Partial<PortfolioState> => ({
      trades: s.trades.filter((t) => t.clientTradeId !== clientTradeId),
    })),

  updateCash: (amount) =>
    set((): Partial<PortfolioState> => ({
      cash: amount,
    })),
});

export const usePortfolioStore = create<PortfolioState>(portfolioStore);
