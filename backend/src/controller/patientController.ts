import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getPatients(req: Request, res: Response) {
  try {
    // await prisma.patient.deleteMany({});
    const patients = await prisma.patient.findMany();

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

    const patient = await prisma.patient.findUnique({ where: { id } });

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
