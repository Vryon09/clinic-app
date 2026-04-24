import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRequest } from "../types/express";

interface IVerifyToken extends JwtPayload {
  id: string;
}

export function verifyToken(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined.");
    }

    const decoded = jwt.verify(token, secret) as IVerifyToken;

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
