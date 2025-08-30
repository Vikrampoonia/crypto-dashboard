import  { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMarketChart, getCurrentPrice } from "../api/cryptoApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type ChartPoint = { time: number; price: number };

const transform = (raw: any[]): ChartPoint[] =>
  raw.map((p: any) => ({ time: p[0], price: Number(p[1]) }));

export default function CryptoChart({
  coinId,
  days = 30,
}: {
  coinId: string;
  days?: number;
}) {
  // Historical chart
  const { data: chartData } = useQuery({
    queryKey: ["marketChart", coinId, days],
    queryFn: () => getMarketChart(coinId, days),
    staleTime: 1000 * 60 * 2,
  });

  // Poll current price every 10s
  const { data: currentPrice } = useQuery({
    queryKey: ["currentPrice", coinId],
    queryFn: () => getCurrentPrice(coinId),
    refetchInterval: 10000,
    staleTime: 5000,
  });

  const points: ChartPoint[] = useMemo(() => {
    const raw = chartData?.prices ?? [];
    const list = transform(raw);
    if (currentPrice) {
      list.push({ time: Date.now(), price: Number(currentPrice) });
    }
    return list;
  }, [chartData, currentPrice]);

  // Prepare data for Recharts
  const rcData = points.map((p) => ({
    time: dayjs(p.time).format("MMM D HH:mm"),
    price: p.price,
  }));

  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rcData}>
          <XAxis dataKey="time" minTickGap={30} />
          <YAxis domain={["dataMin", "dataMax"]} />
          <Tooltip
            formatter={(v: any) => `$${Number(v).toFixed(2)}`}
            labelFormatter={(l) => l}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
