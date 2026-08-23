import { Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";

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

    const target = `${patient.firstName} ${patient.lastName}`;

    await prisma.systemLogs.create({
      data: {
        action: "CREATE",
        module: "Laboratory",
        target,
        details: `Uploaded laboratory result for ${patient.firstName} ${patient.lastName}`,
        userId: req.userId!,
      },
    });

    res.status(200).json(newLabResult);
  } catch (error) {
    res.status(400).json(error);
  }
}
