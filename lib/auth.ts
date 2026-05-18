import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { cookies } from "next/headers";

export const getJwtSecretKey = () => {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error("The environment variable AUTH_JWT_SECRET is not set.");
  }
  return new TextEncoder().encode(secret);
};

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(token, getJwtSecretKey());
    return verified.payload as JWTPayload;
  } catch (_error) {
    return null;
  }
};

export const signToken = async (payload: { role: string }) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());
};

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) throw new Error("Unauthorized");
  const payload = await verifyAuth(token);
  if (!payload) throw new Error("Unauthorized");
  return payload;
}
