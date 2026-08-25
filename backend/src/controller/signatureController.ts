import { Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";
import fs from "node:fs";

export async function getSignature(req: UserRequest, res: Response) {
  try {
    const userId = req.params.userId as string;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const signature = await prisma.signature.findUnique({
      where: { userId },
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

export async function deleteSignature(req: UserRequest, res: Response) {
  try {
    const userId = req.userId;

    const signature = await prisma.signature.findUnique({
      where: { userId },
    });

    if (!signature) {
      return res.status(404).json({ message: "Signature not found." });
    }

    try {
      await fs.promises.unlink(signature.filePath);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }

    await prisma.signature.delete({
      where: { id: signature.id },
    });

    const target = `${userId}`;

    await prisma.systemLogs.create({
      data: {
        action: "DELETE",
        module: "Signature",
        target,
        details: `Deleted signature for ${userId}`,
        userId: req.userId!,
      },
    });

    res.status(200).json({ message: "Signature deleted successfully." });
  } catch (error) {
    res.status(400).json(error);
  }
}
