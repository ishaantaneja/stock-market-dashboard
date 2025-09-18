import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import authRoutes from "./routes/authRoutes";
import marketRoutes from "./routes/marketRoutes";
import portfolioRoutes from "./routes/portfolioRoutes";
import { educationRoutes } from "./routes/educationRoutes";
import { notificationRoutes } from "./routes/notificationRoutes";
import { setupWebsocket } from "./utils/websocket";

const server = Fastify({ logger: true });

// CORS
server.register(cors, {
  origin: process.env.FRONTEND_URL || "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

// JWT
server.register(jwt, { secret: process.env.JWT_SECRET || "supersecret" });

// Global decorator for auth
server.decorate("authenticate", async (request: any, reply: any) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

// Routes
server.register(authRoutes, { prefix: "/auth" });
server.register(marketRoutes, { prefix: "/market" });
server.register(portfolioRoutes);
server.register(educationRoutes, { prefix: "/education" });
server.register(notificationRoutes, { prefix: "/notifications" });

setupWebsocket(server);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await server.listen({ port });
    console.log(`🚀 Server ready at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
