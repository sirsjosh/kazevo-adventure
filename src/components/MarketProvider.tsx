import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMarketByCode, readClientCountry, writeClientCountry, type Market } from "@/lib/market";

interface MarketContextValue {
  market: Market;
  countryCode: string;
  setCountryCode: (code: string) => void;
}

const MarketContext = createContext<MarketContextValue | null>(null);

export function useMarket(): MarketContextValue {
  const ctx = useContext(MarketContext);
  if (!ctx) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return ctx;
}

interface MarketProviderProps {
  children: ReactNode;
  initialCountryCode?: string;
}

export function MarketProvider({ children, initialCountryCode }: MarketProviderProps) {
  const [countryCode, setCountryCodeState] = useState<string>(() => {
    if (initialCountryCode) return initialCountryCode.toUpperCase();
    if (typeof window !== "undefined") {
      return readClientCountry();
    }
    return "US";
  });

  const setCountryCode = useCallback((code: string) => {
    const upper = code.toUpperCase();
    setCountryCodeState(upper);
    writeClientCountry(upper);
  }, []);

  useEffect(() => {
    if (!initialCountryCode) return;
    const upper = initialCountryCode.toUpperCase();
    if (upper !== countryCode) {
      setCountryCodeState(upper);
      writeClientCountry(upper);
    }
  }, [initialCountryCode]);

  const market = getMarketByCode(countryCode);

  return (
    <MarketContext.Provider value={{ market, countryCode, setCountryCode }}>
      {children}
    </MarketContext.Provider>
  );
}
