// backend/src/models/market.ts

/**
 * Market types + small transformers to normalize Finnhub responses
 * (use these in services/marketService.ts before returning to controllers).
 */

/** Current price (normalized) */
export interface MarketPrice {
  symbol: string;
  price: number;          // current price
  high: number;           // high of the day
  low: number;            // low of the day
  open: number;           // open price of the day
  previousClose: number;  // previous close price
  timestamp: number;      // unix epoch (seconds)
}

/** OHLCV candlestick item (normalized) */
export interface MarketHistoryItem {
  timestamp: number; // unix epoch (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Normalize Finnhub quote response -> MarketPrice
 * raw example: { c, h, l, o, pc, t }
 */
export function mapFinnhubQuote(raw: any, symbol: string): MarketPrice {
  const c = typeof raw.c === "number" ? raw.c : Number(raw.c || 0);
  const h = typeof raw.h === "number" ? raw.h : Number(raw.h || 0);
  const l = typeof raw.l === "number" ? raw.l : Number(raw.l || 0);
  const o = typeof raw.o === "number" ? raw.o : Number(raw.o || 0);
  const pc = typeof raw.pc === "number" ? raw.pc : Number(raw.pc || 0);
  const t = typeof raw.t === "number" ? raw.t : Math.floor(Date.now() / 1000);

  return {
    symbol,
    price: c,
    high: h,
    low: l,
    open: o,
    previousClose: pc,
    timestamp: t,
  };
}

/**
 * Normalize Finnhub candle response -> MarketHistoryItem[]
 * raw example: { s: 'ok'|'no_data', c:[], h:[], l:[], o:[], t:[], v:[] }
 */
export function mapFinnhubCandle(raw: any): MarketHistoryItem[] {
  if (!raw || raw.s === "no_data") return [];

  const { c = [], h = [], l = [], o = [], t = [], v = [] } = raw;
  const len = Math.min(c.length, h.length, l.length, o.length, t.length, v.length);

  const out: MarketHistoryItem[] = [];
  for (let i = 0; i < len; i++) {
    out.push({
      timestamp: Number(t[i]),
      open: Number(o[i]),
      high: Number(h[i]),
      low: Number(l[i]),
      close: Number(c[i]),
      volume: Number(v[i]),
    });
  }
  return out;
}
