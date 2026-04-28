import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { UpdateClinicInfoType } from "../schemas/clinicInfoSchema";

export const getClinicInfo = async (req: Request, res: Response) => {
  try {
    const clinic = await prisma.clinic.findFirst();

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    return res.json(clinic);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateClinicInfo = async (req: Request, res: Response) => {
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
};
