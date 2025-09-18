import { FastifyRequest, FastifyReply } from "fastify";
import * as authService from "../services/authService";

export async function signup(req: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) {
  const { email, password } = req.body;
  try {
    const user = await authService.createUser(email, password);
    const token = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "15m" });
    const refreshToken = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "7d" });
    return reply.status(201).send({ token, refreshToken, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    return reply.status(400).send({ error: err.message ?? "Signup failed" });
  }
}

export async function login(req: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) {
  const { email, password } = req.body;
  const user = await authService.validateUser(email, password);
  if (!user) return reply.status(401).send({ error: "Invalid credentials" });

  const token = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "15m" });
  const refreshToken = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "7d" });
  return reply.send({ token, refreshToken, user: { id: user.id, email: user.email } });
}

export async function refresh(req: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
  try {
    const payload = req.server.jwt.verify(req.body.refreshToken) as { id: number; email: string };
    const token = await reply.jwtSign({ id: payload.id, email: payload.email }, { expiresIn: "15m" });
    const refreshToken = await reply.jwtSign({ id: payload.id, email: payload.email }, { expiresIn: "7d" });
    return reply.send({ token, refreshToken });
  } catch (err) {
    return reply.status(401).send({ error: "Invalid refresh token" });
  }
}
