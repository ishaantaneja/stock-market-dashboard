import Fastify from "fastify";
import jwt from "@fastify/jwt";
import authRoutes from "./routes/authRoutes";
import marketRoutes from "./routes/marketRoutes";
import portfolioRoutes from "./routes/portfolioRoutes";
import { educationRoutes } from "./routes/educationRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";

const server = Fastify({ logger: true });

// Register JWT plugin
server.register(jwt, { secret: process.env.JWT_SECRET || "supersecret" });

// ===== GLOBAL AUTH DECORATION =====
server.decorate("authenticate", async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

// Register all routes
server.register(authRoutes, { prefix: "/auth" });
server.register(marketRoutes, { prefix: "/market" });
server.register(portfolioRoutes, { prefix: "/portfolio" });
server.register(educationRoutes, { prefix: "/education" });
server.register(notificationRoutes, { prefix: "/notifications" });

// Start server
server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at ${address}`);
});
