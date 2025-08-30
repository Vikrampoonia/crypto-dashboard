// A mock server-like module to simulate trade processing delays and occasional failures.
// Replace with real backend endpoints later.

export interface TradeRequest {
  userId: string;
  coinId: string;
  side: "buy" | "sell";
  amount: number; // coin amount, not dollars
  price: number; // unit price at which trade is requested
  clientTradeId?: string; // optional local id for optimistic updates
}

export interface TradeResult {
  tradeId: string;
  executedAt: string;
  coinId: string;
  side: "buy" | "sell";
  amount: number;
  price: number;
  total: number;
}

// Configure simulation
let config = {
  minLatencyMs: 300, // minimum network delay
  maxLatencyMs: 2000, // maximum network delay
  failureRate: 0.1, // 10% of trades fail
};

export const setMockConfig = (c: Partial<typeof config>) => {
  config = { ...config, ...c };
};

const randomLatency = () =>
  config.minLatencyMs + Math.floor(Math.random() * (config.maxLatencyMs - config.minLatencyMs + 1));

const shouldFail = () => Math.random() < config.failureRate;

export const sendTrade = (req: TradeRequest): Promise<TradeResult> =>
  new Promise((resolve, reject) => {
    const latency = randomLatency();
    setTimeout(() => {
      if (shouldFail()) {
        reject({ message: "Trade failed due to server error" });
        return;
      }

      const executedAt = new Date().toISOString();
      const total = Number((req.amount * req.price).toFixed(8));
      resolve({
        tradeId: `trade_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        executedAt,
        coinId: req.coinId,
        side: req.side,
        amount: req.amount,
        price: req.price,
        total,
      });
    }, latency);
  });
