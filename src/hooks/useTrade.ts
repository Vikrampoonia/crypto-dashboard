import { useMutation } from "@tanstack/react-query";
import { sendTrade } from "../api/mockTradeApi";
import type { TradeRequest } from "../api/mockTradeApi";
import { usePortfolioStore } from "../store/portfolioStore";
import { v4 as uuidv4 } from "uuid";

/**
 * Hook to perform trades with optimistic updates and rollback
 */
export const useTrade = () => {
  const applyOptimisticTrade = usePortfolioStore((s) => s.applyOptimisticTrade);
  const applyExecutedTrade = usePortfolioStore((s) => s.applyExecutedTrade);
  const markTradeFailed = usePortfolioStore((s) => s.markTradeFailed);

  return useMutation({
    mutationFn: (payload: TradeRequest) => {
      return sendTrade(payload);
    },
    onMutate: async (payload) => {
      // create clientTradeId for correlation
      const clientTradeId = uuidv4();

      // optimistic trade record
      const optimistic: any = {
        tradeId: null,
        clientTradeId,
        coinId: payload.coinId,
        side: payload.side,
        amount: payload.amount,
        price: payload.price,
        total: Number((payload.amount * payload.price).toFixed(8)),
        status: "pending" as const,
        executedAt: null,
      };

      applyOptimisticTrade(optimistic);

      // return context with clientTradeId for onError/onSuccess
      return { clientTradeId };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.clientTradeId) {
        markTradeFailed(context.clientTradeId);
      }
    },
    onSuccess: (data, _vars, context: any) => {
      // merge executed trade with clientTradeId -> finalize
      const executed = {
        ...data,
        clientTradeId: context?.clientTradeId,
        status: "executed" as const,
      };
      applyExecutedTrade(executed);
    },
  });
};
