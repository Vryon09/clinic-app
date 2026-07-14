import { Request, Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";

// await prisma.patient.deleteMany({});
// await prisma.record.deleteMany({});
// await prisma.labResult.deleteMany({});

export async function getPatients(req: Request, res: Response) {
  try {
    const patients = await prisma.patient.findMany({
      include: { records: true },
    });

    res.status(200).json(patients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function getArchivedPatients(req: Request, res: Response) {
  try {
    const limit = Math.max(1, parseInt(req.query.limit as string)) || 10;
    const page = Math.max(1, parseInt(req.query.page as string)) || 1;
    const skip = (page - 1) * limit;

    const where = { isArchived: true };

    const [patients, total] = await prisma.$transaction([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.patient.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: patients,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function searchPatients(req: Request, res: Response) {
  try {
    const searchInput = (req.query.search as string) || "";
    const limit = Math.max(1, parseInt(req.query.limit as string)) || 10;
    const page = Math.max(1, parseInt(req.query.page as string)) || 1;
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { firstName: { contains: searchInput, mode: "insensitive" as const } },
        { middleName: { contains: searchInput, mode: "insensitive" as const } },
        { lastName: { contains: searchInput, mode: "insensitive" as const } },
        { phone: { contains: searchInput, mode: "insensitive" as const } },
      ],
      isArchived: false,
    };

    const [patients, total] = await prisma.$transaction([
      prisma.patient.findMany({
        where,
        orderBy: [
          { lastName: "asc" },
          { firstName: "asc" },
          { middleName: "asc" },
        ],
        skip,
        take: limit,
      }),
      prisma.patient.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: patients,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function getPatient(req: Request, res: Response) {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return res.status(400).json({ error: "No id found" });
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { records: true },
    });

    res.status(200).json(patient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function addPatient(req: UserRequest, res: Response) {
  try {
    const { phone } = req.body;
    const isPatientExisted = await prisma.patient.findUnique({
      where: { phone },
    });

    if (isPatientExisted) {
      return res.status(409).json({ error: "Phone number already existed" });
    }

    const newPatient = await prisma.patient.create({ data: { ...req.body } });

    if (newPatient) {
      await prisma.case.create({
        data: { caseName: "Default", patientId: newPatient.id },
      });

      await prisma.systemLogs.create({
        data: {
          action: "CREATE",
          module: "Patient",
          target: `${newPatient.firstName} ${newPatient.lastName} (${newPatient.id})`,
          details: `Created patient record for ${newPatient.firstName} ${newPatient.lastName} (${newPatient.id})`,
          userId: req.userId!,
        },
      });
    }

    res.status(201).json(newPatient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function deletePatient(req: UserRequest, res: Response) {
  try {
    const patientId = req.params.id as string;

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

    const target = `${patient.firstName} ${patient.lastName} (${patientId})`;

    await prisma.systemLogs.create({
      data: {
        action: "DELETE",
        module: "Patient",
        target,
        details: `Deleted all medical records for ${patient.firstName} ${patient.lastName} (${patientId})`,
        userId: req.userId!,
      },
    });

    await prisma.$transaction([
      prisma.record.deleteMany({ where: { patientId } }),
      prisma.patient.delete({ where: { id: patientId } }),
    ]);

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function archivePatient(req: UserRequest, res: Response) {
  try {
    const patientId = req.params.id as string;

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

    const target = `${patient.firstName} ${patient.lastName} (${patientId})`;

    await prisma.patient.update({
      where: { id: patientId },
      data: { isArchived: true, archivedOn: new Date().toISOString() },
    });

    await prisma.systemLogs.create({
      data: {
        action: "ARCHIVE",
        module: "Patient",
        target,
        details: `Archived patient record for ${patient.firstName} ${patient.lastName} (${patientId})`,
        userId: req.userId!,
      },
    });

    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function restorePatient(req: UserRequest, res: Response) {
  try {
    const patientId = req.params.id as string;

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

    const target = `${patient.firstName} ${patient.lastName} (${patientId})`;

    await prisma.patient.update({
      where: { id: patientId },
      data: { isArchived: false, archivedOn: null },
    });

    await prisma.systemLogs.create({
      data: {
        action: "RESTORE",
        module: "Patient",
        target,
        details: `Restored patient profile for ${patient.firstName} ${patient.lastName} (${patientId})`,
        userId: req.userId!,
      },
    });

    res.status(200).json({ message: "Patient Restored Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function updatePatient(req: UserRequest, res: Response) {
  try {
    const patientId = req.params.id as string;

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

    const target = `${patient.firstName} ${patient.lastName} (${patientId})`;

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: req.body,
    });

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "Patient",
        target,
        details: `Updated patient profile for ${patient.firstName} ${patient.lastName} (${patientId})`,
        userId: req.userId!,
      },
    });

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
