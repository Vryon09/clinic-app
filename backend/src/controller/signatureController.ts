import { Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";

export async function getSignature(req: UserRequest, res: Response) {
  try {
    const signature = await prisma.signature.findUnique({
      where: { userId: req.userId },
    });

    if (!signature) {
      return res.status(404).json({ message: "Signature not found." });
    }

    res.status(200).json(signature);
  } catch (error) {
    res.status(400).json(error);
  }
}

export async function uploadSignature(req: UserRequest, res: Response) {
  try {
    const filePath = req.file?.path as string;

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

    if (!filePath) {
      res.status(400).json({ error: "No file path found." });
      return;
    }

    const newSignature = await prisma.signature.create({
      data: { userId: user.id, filePath },
    });

    const target = `${user.id}`;

    await prisma.systemLogs.create({
      data: {
        action: "CREATE",
        module: "Signature",
        target,
        details: `Uploaded signature for ${user.id}`,
        userId: req.userId!,
      },
    });

    res.status(200).json(newSignature);
  } catch (error) {
    res.status(400).json(error);
  }
}
