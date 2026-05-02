import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { UpdateClinicInfoType } from "../schemas/clinicInfoSchema";

export async function initClinicInfo(req: Request, res: Response) {
  try {
    const initialClinicInfo = await prisma.clinic.upsert({
      where: { id: "default-clinic-id" },
      update: {},
      create: {
        id: "default-clinic-id",
        name: "Clinic",
        address: "Your Address Here",
        phone: "09XX-XXX-XXXX",
      },
    });

    if (!initialClinicInfo) {
      res.status(400).json({ message: "Cannot initialize clinic info" });
      return;
    }

    res.status(201).json(initialClinicInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getClinicInfo(req: Request, res: Response) {
  try {
    const clinic = await prisma.clinic.findFirst();

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    return res.json(clinic);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateClinicInfo(req: Request, res: Response) {
  try {
    const data: UpdateClinicInfoType = req.body;

    const clinic = await prisma.clinic.findFirst();

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const updated = await prisma.clinic.update({
      where: { id: clinic.id },
      data,
    });

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: "Invalid input", error });
  }
}
