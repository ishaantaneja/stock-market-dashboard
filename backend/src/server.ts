import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";

import authRoutes from "./routes/authRoutes";
import marketRoutes from "./routes/marketRoutes";
import portfolioRoutes from "./routes/portfolioRoutes";
import { educationRoutes } from "./routes/educationRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";

const server = Fastify({ logger: true });

// ✅ Enable CORS for Angular frontend
server.register(cors, {
  origin: "http://localhost:4200", // Angular dev server
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

// ✅ JWT setup
server.register(jwt, { secret: process.env.JWT_SECRET || "supersecret" });

// Decorator for routes needing auth
server.decorate("authenticate", async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

// ✅ Register routes
server.register(authRoutes, { prefix: "/auth" });
server.register(marketRoutes, { prefix: "/market" });
server.register(portfolioRoutes, { prefix: "/portfolio" });
server.register(educationRoutes, { prefix: "/education" });
server.register(notificationRoutes, { prefix: "/notifications" });

// ✅ Start server
const start = async () => {
  try {
    await server.listen({ port: 3000 });
    console.log("🚀 Server ready at http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
