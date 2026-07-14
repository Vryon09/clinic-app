import { Request, Response } from "express";
import { UserRequest } from "../types/express";
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

export async function uploadLabResult(req: UserRequest, res: Response) {
  try {
    const patientId = req.body.patientId;
    const filePath = req.file?.path as string;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (!filePath) {
      res.status(400).json({ error: "No file path found." });
      return;
    }

    const newLabResult = await prisma.labResult.create({
      data: { patientId, filePath },
    });

    const target = `Laboratory Result (${newLabResult.id})`;

    await prisma.systemLogs.create({
      data: {
        action: "CREATE",
        module: "Laboratory",
        target,
        details: `Uploaded laboratory result for ${patient.firstName} ${patient.lastName} (${patientId})`,
        userId: req.userId!,
      },
    });

    res.status(200).json(newLabResult);
  } catch (error) {
    res.status(400).json(error);
  }
}

export async function deleteLabResult(req: UserRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const labResult = await prisma.labResult.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!labResult) {
      return res.status(400).json({ error: "No Lab Result found." });
    }

    try {
      await fs.promises.unlink(labResult.filePath);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }

    const target = `Lab Result (${labResult.id})`;

    await prisma.labResult.delete({ where: { id } });

    await prisma.systemLogs.create({
      data: {
        action: "DELETE",
        module: "Laboratory",
        target,
        details: `Deleted laboratory result for ${labResult.patient.firstName} ${labResult.patient.lastName} (${labResult.patientId})`,
        userId: req.userId!,
      },
    });

    res.status(200).json({ message: "Lab result deleted successfully." });
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
  }
}
