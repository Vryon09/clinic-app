import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRequest } from "../types/express";

interface IVerifyToken extends JwtPayload {
  id: string;
  role: "ADMIN" | "DOCTOR" | "ASSISTANT";
}

export function verifyToken(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined.");
    }

    const decoded = jwt.verify(token, secret) as IVerifyToken;

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
