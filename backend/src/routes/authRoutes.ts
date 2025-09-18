import { FastifyInstance } from "fastify";
import { signup, login, refresh } from "../controllers/authController";

export default async function authRoutes(server: FastifyInstance) {
  server.post("/signup", signup);   // changed from /register
  server.post("/login", login);
  server.post("/refresh", refresh);
}
