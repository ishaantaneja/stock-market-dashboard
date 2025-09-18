import axios from "axios";
import { MarketPrice, MarketHistoryItem } from "../models/market";

const FINNHUB_KEY = process.env.FINNHUB_KEY;
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

const apiCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

async function fetchFromFinnhub(endpoint: string): Promise<any> {
  if (!FINNHUB_KEY) throw new Error("Finnhub API key missing in .env");

  const cacheKey = `${FINNHUB_BASE_URL}/${endpoint}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await axios.get(`${FINNHUB_BASE_URL}/${endpoint}`, {
    params: { token: FINNHUB_KEY },
  });

  apiCache.set(cacheKey, { timestamp: Date.now(), data: response.data });
  return response.data;
}

/** Get current stock price */
export async function getMarketPrice(symbol: string): Promise<MarketPrice> {
  const data = await fetchFromFinnhub(`quote?symbol=${symbol}`);
  return {
    symbol,
    price: data.c,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
    timestamp: data.t,
  };
}

/** Get historical price data */
export async function getMarketHistory(symbol: string, range: string): Promise<MarketHistoryItem[]> {
  const now = Math.floor(Date.now() / 1000);
  let from = now - 60 * 60 * 24 * 30; // default 1 month
  let resolution = "D";

  switch (range) {
    case "1d": from = now - 60 * 60 * 24; resolution = "1"; break;
    case "1w": from = now - 60 * 60 * 24 * 7; resolution = "60"; break;
    case "1m": from = now - 60 * 60 * 24 * 30; resolution = "D"; break;
    case "1y": from = now - 60 * 60 * 24 * 365; resolution = "W"; break;
  }

  const data = await fetchFromFinnhub(`stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${now}`);
  if (!data || data.s === "no_data") return [];

  return data.t.map((timestamp: number, i: number) => ({
    timestamp,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
    volume: data.v[i],
  }));
}
