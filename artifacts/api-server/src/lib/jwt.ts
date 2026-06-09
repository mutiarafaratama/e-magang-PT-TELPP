import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "emagang-telpp-replit-jwt-secret-key-2025-sangat-panjang-dan-aman";
const EXPIRY = process.env.JWT_EXPIRY || "24h";

export interface JwtPayload {
  user_id: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
