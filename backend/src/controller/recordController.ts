import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function addRecord(req: Request, res: Response) {
  try {
    if (!req.body.patientId)
      return res.status(400).json({ error: "patientId not found." });

    const newRecord = await prisma.record.create({
      data: req.body,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
