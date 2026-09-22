import jwt from "jsonwebtoken";
import "../db/loadEnv";

type JWTPayload = {
  id: string;
  email: string;
};

function getJWTSecret() {
  const secret = process.env.JWT_SECRET || "medsecure-jwt-default-dev-secret-key-2026";
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