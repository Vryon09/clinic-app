import type { Request, Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";

export async function getCases(req: Request, res: Response) {
  try {
    const patientId = req.params.patientId as string;

    const cases = await prisma.case.findMany({
      where: { patientId, isArchived: false },
      include: {
        doctor: true,
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

export async function updateCase(req: UserRequest, res: Response) {
  try {
    const { patientId, caseId } = req.params as {
      patientId: string;
      caseId: string;
    };

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

    const updatedCase = await prisma.case.update({
      where: { id: caseId },
      data: {
        caseName,
        doctorId,
      },
    });

    const target = `${updatedCase.caseName}`;

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "Case",
        target,
        details: `Updated case (${caseName})`,
        userId: req.userId!,
      },
    });

    res.status(201).json({ message: "New case successfully created." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function archiveCase(req: UserRequest, res: Response) {
  try {
    const caseId = req.params.id as string;

    const selectedCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!selectedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    const target = `${selectedCase.caseName}`;

    await prisma.case.update({
      where: { id: caseId },
      data: { isArchived: true, archivedOn: new Date().toISOString() },
    });

    await prisma.systemLogs.create({
      data: {
        action: "ARCHIVE",
        module: "Case",
        target,
        details: `Archived case (${selectedCase.caseName})`,
        userId: req.userId!,
      },
    });

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function restoreCase(req: UserRequest, res: Response) {
  try {
    const caseId = req.params.id as string;

    const selectedCase = await prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!selectedCase) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const target = `${selectedCase.caseName}`;

    await prisma.case.update({
      where: { id: caseId },
      data: { isArchived: false, archivedOn: null },
    });

    await prisma.systemLogs.create({
      data: {
        action: "RESTORE",
        module: "Case",
        target,
        details: `Restored case (${selectedCase.caseName})`,
        userId: req.userId!,
      },
    });

    res.status(200).json({ message: "Case Restored Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function getArchivedCases(req: Request, res: Response) {
  try {
    const limit = Math.max(1, parseInt(req.query.limit as string)) || 10;
    const page = Math.max(1, parseInt(req.query.page as string)) || 1;
    const skip = (page - 1) * limit;

    const where = { isArchived: true };

    const [cases, total] = await prisma.$transaction([
      prisma.case.findMany({
        where,
        include: { patient: true, doctor: true },
        skip,
        take: limit,
      }),
      prisma.case.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: cases,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
