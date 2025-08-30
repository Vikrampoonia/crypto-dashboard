import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

export const getTopCryptos = async () => {
  const { data } = await axios.get(
    `${BASE_URL}/coins/markets`,
    {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    }
  );
  return data;
};




// get historical market chart for a coin (days: 1,7,30,90,365)
export const getMarketChart = async (id: string, days = 30) => {
  const { data } = await axios.get(`${BASE_URL}/coins/${id}/market_chart`, {
    params: { vs_currency: "usd", days },
  });
  
  return data;
};


// get current price (single coin)
export const getCurrentPrice = async (id: string) => {
  const { data } = await axios.get(`${BASE_URL}/simple/price`, {
    params: { ids: id, vs_currencies: "usd" },
  });
  return data[id]?.usd ?? null;
};

