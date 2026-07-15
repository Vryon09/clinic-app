import type { Request, Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";

export async function getCases(req: Request, res: Response) {
  try {
    const patientId = req.params.patientId as string;

    const cases = await prisma.case.findMany({
      where: { patientId },
      include: {
        records: {
          where: { isArchived: false },
          orderBy: { visitDate: "desc" },
        },
      },
    });

    res.status(200).json(cases);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function addCase(req: UserRequest, res: Response) {
  try {
    const patientId = req.params.patientId as string;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        firstName: true,
        lastName: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const { caseName, doctorId } = req.body as {
      caseName: string;
      doctorId: string;
    };

    const newCase = await prisma.case.create({
      data: {
        caseName,
        patientId,
        doctorId,
      },
    });

    const target = `${newCase.caseName}`;

    await prisma.systemLogs.create({
      data: {
        action: "CREATE",
        module: "Case",
        target,
        details: `Created new case for ${patient.firstName} ${patient.lastName}`,
        userId: req.userId!,
      },
    });

    res.status(201).json({ message: "New case successfully created." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
