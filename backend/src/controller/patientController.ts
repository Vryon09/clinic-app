import { Request, Response } from "express";
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

export async function addPatient(req: Request, res: Response) {
  try {
    const newPatient = await prisma.patient.create({ data: { ...req.body } });

    res.status(201).json(newPatient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function deletePatient(req: Request, res: Response) {
  try {
    const patientId = req.params.id as string;

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

export async function updatePatient(req: Request, res: Response) {
  try {
    const patientId = req.params.id as string;
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: req.body,
    });

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
