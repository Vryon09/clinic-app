import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getPatients(req: Request, res: Response) {
  try {
    const patients = await prisma.patient.findMany();

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function addPatient(req: Request, res: Response) {
  try {
    const newPatient = await prisma.patient.create({ data: { ...req.body } });

    res.status(201).json(newPatient);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
