import { prisma } from "../db/prismaClient";
import argon2 from "argon2";

export async function createUser(email: string, password: string) {
  const hashed = await argon2.hash(password);
  return prisma.user.create({ data: { email, passwordHash: hashed } });
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await argon2.verify(user.passwordHash, password);
  return valid ? user : null;
}
