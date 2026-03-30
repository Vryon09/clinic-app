import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function uploadLabResult(req: Request, res: Response) {
  try {
    const patientId = req.body.patientId;
    const filePath = req.file?.path as string;

    if (!filePath) {
      res.status(400).json({ error: "No file path found." });
      return;
    }

    const newLabResult = await prisma.labResult.create({
      data: { patientId, filePath },
    });

    res.status(200).json(newLabResult);
  } catch (error) {
    res.status(400).json(error);
  }
}
