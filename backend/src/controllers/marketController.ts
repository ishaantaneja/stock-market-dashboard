// backend/src/controllers/marketController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";

const FINNHUB_KEY = process.env.FINNHUB_KEY;

export async function getMarketPriceHandler(
  req: FastifyRequest<{ Params: { symbol: string } }>,
  reply: FastifyReply
) {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`
    );

    // response.data = { c: current, h: high, l: low, o: open, pc: prevClose }
    reply.send({ price: response.data.c });
  } catch (err) {
    console.error("Finnhub API error:", err);
    reply.status(500).send({ error: "Failed to fetch price" });
  }
}

export async function getMarketHistoryHandler(
  req: FastifyRequest<{ Params: { symbol: string }; Querystring: { range?: string } }>,
  reply: FastifyReply
) {
  const symbol = req.params.symbol.toUpperCase();
  const range = req.query.range || "1m";

  try {
    // Optional: implement historical data via Finnhub if needed
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&count=30&token=${FINNHUB_KEY}`
    );

    reply.send(response.data);
  } catch (err) {
    console.error("Finnhub history error:", err);
    reply.status(500).send({ error: "Failed to fetch market history" });
  }
}
