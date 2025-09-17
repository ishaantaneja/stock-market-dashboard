import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/prismaClient";
import * as argon2 from "argon2";

// Signup
export async function signup(
  req: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return reply.status(400).send({ error: "User already exists" });
  }

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  // Sign tokens
  const token = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "15m" });
  const refreshToken = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "7d" });

  return reply.send({ token, refreshToken, user: { id: user.id, email: user.email } });
}

// Login
export async function login(
  req: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return reply.status(400).send({ error: "Invalid credentials" });

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) return reply.status(400).send({ error: "Invalid credentials" });

  const token = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "15m" });
  const refreshToken = await reply.jwtSign({ id: user.id, email: user.email }, { expiresIn: "7d" });

  return reply.send({ token, refreshToken, user: { id: user.id, email: user.email } });
}

// Refresh token
export async function refresh(
  req: FastifyRequest<{ Body: { refreshToken: string } }>,
  reply: FastifyReply
) {
  try {
    // Verify the refresh token manually using fastify.jwt.verify
    const payload = req.server.jwt.verify(req.body.refreshToken) as { id: number; email: string };

    // Issue new tokens
    const token = await reply.jwtSign({ id: payload.id, email: payload.email }, { expiresIn: "15m" });
    const refreshToken = await reply.jwtSign({ id: payload.id, email: payload.email }, { expiresIn: "7d" });

    return reply.send({ token, refreshToken });
  } catch (err) {
    return reply.status(401).send({ error: "Invalid refresh token" });
  }
}
