import dotenv from "dotenv";

dotenv.config();

// Environment variables are accessed here to provide a single source of truth.
// This prevents direct access to `process.env` throughout the application.
export const CONFIG = {
  port: parseInt(process.env.PORT || "4000", 10),
  jwt: {
    secret: process.env.JWT_SECRET || "supersecretjwtkey",
  },
  databaseUrl: process.env.DATABASE_URL!,
  market: {
    apiKey: process.env.MARKET_API_KEY || "demo", // Alpha Vantage demo key
  },
};
