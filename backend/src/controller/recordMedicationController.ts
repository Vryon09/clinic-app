import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function getRecordMedications(req: Request, res: Response) {
  try {
    const recordMedications = await prisma.recordMedication.findMany({
      where: { recordId: req.params.recordId as string },
    });

    res.status(200).json(recordMedications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
