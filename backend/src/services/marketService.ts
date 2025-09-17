// src/services/marketService.ts
import axios from "axios";

const API_KEY = process.env.MARKET_API_KEY || "demo";
const BASE_URL = "https://www.alphavantage.co/query";

const priceCache = new Map<string, { ts: number; data: any }>();
const historyCache = new Map<string, { ts: number; data: any }>();

const PRICE_TTL = 10_000; // 10s cache for price (ms)
const HISTORY_TTL = 1000 * 60 * 60 * 6; // 6h cache for history (ms)

function normalizeSymbol(sym: string) {
  return sym.trim().toUpperCase();
}

function checkApiError(body: any) {
  if (!body) throw new Error("Empty response from market provider");
  if (body.Note) throw new Error("Market API rate limit: " + body.Note);
  if (body["Error Message"]) throw new Error("Market API error: " + body["Error Message"]);
}

// Fetch and normalize current price
export async function fetchPrice(symbol: string) {
  const sym = normalizeSymbol(symbol);
  const key = `price:${sym}`;
  const now = Date.now();

  const cached = priceCache.get(key);
  if (cached && now - cached.ts < PRICE_TTL) return cached.data;

  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(sym)}&apikey=${API_KEY}`;

  try {
    const res = await axios.get(url, { timeout: 5000 });
    const body = res.data;
    checkApiError(body);

    const quote = body["Global Quote"] || {};
    const priceRaw = quote["05. price"] ?? quote["05. price"] ?? null;
    const price = priceRaw ? Number(priceRaw) : null;

    const out = {
      symbol: sym,
      price,
      timestamp: Date.now(),
      raw: body,
    };

    priceCache.set(key, { ts: now, data: out });
    return out;
  } catch (err: any) {
    throw new Error(err.message ?? "Failed to fetch price");
  }
}

// Fetch and normalize historical OHLCV
export async function fetchHistory(symbol: string, days = 365) {
  const sym = normalizeSymbol(symbol);
  const key = `history:${sym}:${days}`;
  const now = Date.now();

  const cached = historyCache.get(key);
  if (cached && now - cached.ts < HISTORY_TTL) return cached.data;

  const url = `${BASE_URL}?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(sym)}&outputsize=full&apikey=${API_KEY}`;

  try {
    const res = await axios.get(url, { timeout: 7000 });
    const body = res.data;
    checkApiError(body);

    const series = body["Time Series (Daily)"] || {};
    const arr = Object.entries(series).map(([date, vals]) => {
      const v = vals as Record<string, string>;
      return {
        date,
        open: Number(v["1. open"]),
        high: Number(v["2. high"]),
        low: Number(v["3. low"]),
        close: Number(v["4. close"]),
        adjustedClose: Number(v["5. adjusted close"] ?? v["4. close"]),
        volume: Number(v["6. volume"] ?? v["5. volume"] ?? 0),
      };
    })
    // sort ascending by date
    .sort((a, b) => a.date.localeCompare(b.date));

    const sliced = days > 0 ? arr.slice(-days) : arr; // last `days` entries

    const out = {
      symbol: sym,
      history: sliced,
      timestamp: Date.now(),
      raw: body,
    };

    historyCache.set(key, { ts: now, data: out });
    return out;
  } catch (err: any) {
    throw new Error(err.message ?? "Failed to fetch history");
  }
}
