import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

// Step 1: Load all coins once (for searching)
const fetchAllCoins = async () => {
  const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/list");
  return data; // [{id, symbol, name}]
};

export const usePaginatedCryptos = (search: string) => {
  // load all coins
  const { data: allCoins, isLoading: isAllCoinsLoading } = useQuery({
    queryKey: ["allCoins"],
    queryFn: fetchAllCoins,
    staleTime: 1000 * 60 * 60, // 1h cache
  });

  // Step 2: Guard against undefined while still loading
  let matchedIds: string[] = [];
  if (search && allCoins) {
    matchedIds = allCoins
      .filter(
        (c: any) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.symbol.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 50) // limit to first 50 results
      .map((c: any) => c.id);
  }

  // Step 3: Paginate market data
  return useInfiniteQuery({
    queryKey: ["cryptos", search, matchedIds],
    queryFn: async ({ pageParam = 1 }) => {
      const perPage = 20;

      let url;
      if (search && matchedIds.length > 0) {
        // fetch chunk of matched IDs
        const chunk = matchedIds.slice((pageParam - 1) * perPage, pageParam * perPage);
        url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${chunk.join(
          ","
        )}`;
      } else {
        // default top coins when no search
        url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${pageParam}`;
      }

      const { data } = await axios.get(url);
      return {
        items: data,
        hasMore: data.length === perPage,
      };
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    // ✅ Prevent running query until allCoins are fetched (when searching)
    enabled: !search || (!!allCoins && matchedIds.length > 0),
  });
};
