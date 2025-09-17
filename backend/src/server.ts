import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { authRoutes } from "./routes/authRoutes";
import { portfolioRoutes } from "./routes/portfolioRoutes";
import { marketRoutes } from "./routes/marketRoutes";

dotenv.config();

const server = Fastify({ logger: true });

server.register(cors, { origin: "*" });
server.register(jwt, { secret: process.env.JWT_SECRET! });

// Register routes
server.register(authRoutes, { prefix: "/auth" });
server.register(portfolioRoutes, { prefix: "/portfolio" });
server.register(marketRoutes, { prefix: "/market" });

const start = async () => {
  try {
    await server.listen({ port: 4000 });
    console.log("Server running on http://localhost:4000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
