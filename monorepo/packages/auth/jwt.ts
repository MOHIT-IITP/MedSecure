import jwt from "jsonwebtoken";
import "../db/loadEnv";

type JWTPayload = {
  id: string;
  email: string;
};

function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

export function generateJWT(payload: JWTPayload) {
  return jwt.sign(payload, getJWTSecret(), { expiresIn: "7d" });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJWTSecret()) as JWTPayload;
  } catch {
    return null;
  }
}