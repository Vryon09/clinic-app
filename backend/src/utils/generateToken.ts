import jwt from "jsonwebtoken";

export function generateToken(userId: string, role: string) {
  const payload = { id: userId, role };

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined.");
  }

  const token = jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "7d") as jwt.SignOptions["expiresIn"],
  });

  return token;
}
