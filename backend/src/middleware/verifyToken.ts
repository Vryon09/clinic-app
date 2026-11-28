import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";
import { getRoleAccess } from "../rbac/accessService";

interface IVerifyToken {
  id: string;
  role: string;
}

export async function verifyToken(
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const access = await getRoleAccess(user.role);
    if (!access) {
      return res.status(401).json({ message: "Role not found" });
    }

    req.userId = user.id;
    req.role = user.role;
    req.access = access;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
