// src/components/PortfolioSummary.tsx
import { usePortfolioStore } from "../store/portfolioStore";

export default function PortfolioSummary() {
  const { cash, holdings } = usePortfolioStore();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Portfolio</h3>
      <p className="mb-4">💵 Cash: ${cash.toFixed(2)}</p>

      <h4 className="font-semibold mb-1">Holdings:</h4>
      {Object.values(holdings).length === 0 ? (
        <p className="text-sm text-gray-500">No holdings yet.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {Object.values(holdings).map((h) => (
            <li key={h.coinId}>
              {h.coinId}: {h.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
