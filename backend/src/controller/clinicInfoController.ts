import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { updateClinicInfo as updateClinicInfoSchema } from "../schemas/clinicInfoSchema";

export const updateClinicInfo = async (req: Request, res: Response) => {
  try {
    const parsed = updateClinicInfoSchema.parse(req.body);

    const clinic = await prisma.clinic.findFirst();

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const updated = await prisma.clinic.update({
      where: { id: clinic.id },
      data: parsed,
    });

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: "Invalid input", error });
  }
};
