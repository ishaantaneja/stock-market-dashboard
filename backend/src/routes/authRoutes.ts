import { FastifyInstance } from "fastify";
import { signup, login, refresh } from "../controllers/authController";

export async function authRoutes(server: FastifyInstance) {
  server.post("/signup", signup);
  server.post("/login", login);
  server.post("/refresh", refresh);
}
