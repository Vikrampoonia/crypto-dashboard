import { useQuery } from "@tanstack/react-query";
import { getTopCryptos } from "./cryptoApi";

export const useCryptos = () => {
  return useQuery({
    queryKey: ["cryptos"],
    queryFn: getTopCryptos,
    staleTime: 1000 * 60, // 1 min cache
  });
};
