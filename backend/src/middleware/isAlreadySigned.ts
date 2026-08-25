import { NextFunction, Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";

export function isAlreadySigned() {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        username: true,
        id: true,
        signatures: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.signatures) {
      console.log(123);
      return next();
    }

    return res.status(400).json({ message: "Already has signature." });
  };
}
