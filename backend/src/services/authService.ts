import prisma from "../db/prismaClient";
import argon2 from "argon2";

export interface AuthUser {
  id: number;    // match your Prisma schema (User.id is Int)
  email: string;
}

/**
 * Create a new user
 */
export async function createUser(email: string, password: string): Promise<AuthUser> {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  return { id: user.id, email: user.email }; // id is now number
}

/**
 * Validate user credentials
 */
export async function validateUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await argon2.verify(user.passwordHash, password);
  return valid ? { id: user.id, email: user.email } : null;
}
