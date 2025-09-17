import { FastifyInstance } from "fastify";

// Register JWT helper functions for Fastify
export const registerJwtUtils = (fastify: FastifyInstance) => {
  // Sign short-lived access token (15 mins)
  const signToken = (payload: object) => {
    return fastify.jwt.sign(payload, { expiresIn: "15m" });
  };

  // Sign long-lived refresh token (7 days)
  const signRefreshToken = (payload: object) => {
    return fastify.jwt.sign(payload, { expiresIn: "7d" });
  };

  // Verify a token manually (optional, usually use req.jwtVerify())
  const verifyToken = (token: string) => {
    return fastify.jwt.verify(token);
  };

  return { signToken, signRefreshToken, verifyToken };
};
