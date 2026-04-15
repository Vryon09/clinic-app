import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import fs from "node:fs";
import { success } from "zod";

export async function getLabResults(req: Request, res: Response) {
  try {
    const { patientId } = req.params as { patientId: string };
    const page = Math.max(1, parseInt(req.query.page as string)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit as string)) || 10;
    const skip = (page - 1) * limit;

    const where = { patientId };

    const [labResults, total] = await prisma.$transaction([
      prisma.labResult.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.labResult.count({ where }),
    ]);

    res.status(200).json({
      data: labResults,
      success: true,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
    console.error(error);
  }
}

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

export async function deleteLabResult(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const labResult = await prisma.labResult.findUnique({
      where: { id },
    });

    if (!labResult) {
      return res.status(400).json({ error: "No Lab Result found." });
    }

    try {
      await fs.promises.unlink(labResult.filePath);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }

    await prisma.labResult.delete({ where: { id } });

    res.status(200).json({ message: "Lab result deleted successfully." });
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
  }
}
