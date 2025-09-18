import { FastifyInstance } from "fastify";

// Utility functions for JWT operations.
// Currently, the Fastify JWT plugin is used directly in the controllers for convenience.
// This utility can be used for a future refactor to consolidate JWT logic.
export const registerJwtUtils = (fastify: FastifyInstance) => {
  const signToken = (payload: object) => {
    return fastify.jwt.sign(payload, { expiresIn: "15m" });
  };
  const signRefreshToken = (payload: object) => {
    return fastify.jwt.sign(payload, { expiresIn: "7d" });
  };
  const verifyToken = (token: string) => {
    return fastify.jwt.verify(token);
  };
  return { signToken, signRefreshToken, verifyToken };
};
