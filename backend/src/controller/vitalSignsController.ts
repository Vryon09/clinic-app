import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function addVitalSigns(req: Request, res: Response) {
  try {
    const newVitalSigns = await prisma.vitalSigns.create({ data: req.body });

    res.status(201).json(newVitalSigns);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function getVitalSign(req: Request, res: Response) {
  try {
    const vitalSign = await prisma.vitalSigns.findUnique({
      where: { recordId: req.params.recordId as string },
    });

    res.status(200).json(vitalSign);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
