import { useMarket } from "@/components/MarketProvider";
import { SUPPORTED_MARKETS } from "@/lib/market";

export function CountrySelector() {
  const { countryCode, setCountryCode } = useMarket();

  return (
    <div className="relative inline-flex items-center">
      <span className="pointer-events-none absolute left-2 text-sm" aria-hidden="true">
        {SUPPORTED_MARKETS.find((m) => m.code === countryCode)?.flag ?? "🌐"}
      </span>
      <select
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        aria-label="Select country and currency"
        className="appearance-none rounded-md border border-border bg-background py-1.5 pl-8 pr-7 text-sm font-medium text-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {SUPPORTED_MARKETS.map((market) => (
          <option key={market.code} value={market.code}>
            {market.label} ({market.currency})
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 h-4 w-4 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
