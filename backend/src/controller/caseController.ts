import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getCases(req: Request, res: Response) {
  try {
    const patientId = req.params.patientId as string;

    const cases = await prisma.case.findMany({ where: { patientId } });

    res.status(200).json(cases);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
