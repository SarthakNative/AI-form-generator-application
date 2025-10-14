import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createToken(userId: string) {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as { userId: string };
}
