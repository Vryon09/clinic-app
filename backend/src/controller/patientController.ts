import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getPatients(req: Request, res: Response) {
  try {
    // await prisma.patient.deleteMany({});
    // await prisma.record.deleteMany({});
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

    if (searchInput === "") {
      return res.status(200).json([]);
    }

    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: searchInput, mode: "insensitive" } },
          { middleName: { contains: searchInput, mode: "insensitive" } },
          { lastName: { contains: searchInput, mode: "insensitive" } },
          { phone: { contains: searchInput, mode: "insensitive" } },
        ],
      },
    });

    res.status(200).json(patients);
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
