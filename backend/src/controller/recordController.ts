import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { regex } from "zod";
import { text } from "node:stream/consumers";
import { IRecordMedication } from "../types/RecordMedication";
import { CreateRecordMedicationInput } from "../schemas/recordMedication";

export async function getRecords(req: Request, res: Response) {
  try {
    const limit = Math.max(1, parseInt(req.query.limit as string)) || 10;
    const page = Math.max(1, parseInt(req.query.page as string)) || 1;
    const skip = (page - 1) * limit;

    const where = { patientId: req.params.id as string };

    const [records, total] = await prisma.$transaction([
      prisma.record.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.record.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: records,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function getRecord(req: Request, res: Response) {
  try {
    const record = await prisma.record.findUnique({
      where: { id: req.params.id as string },
    });

    res.status(200).json(record);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function addRecord(req: Request, res: Response) {
  try {
    const {
      patientId,
      symptoms,
      signs,
      diagnosis,
      vitalSigns,
      recordMedications,
    } = req.body;

    if (!req.body.patientId)
      return res.status(400).json({ error: "patientId not found." });

    const record = await prisma.$transaction(async (tx) => {
      const newRecord = await tx.record.create({
        data: { patientId, symptoms, signs, diagnosis },
      });

      if (vitalSigns) {
        await tx.vitalSigns.create({
          data: { recordId: newRecord.id, ...vitalSigns },
        });
      }

      if (recordMedications.length >= 1) {
        await tx.recordMedication.createMany({
          data: recordMedications.map((medication: IRecordMedication) => {
            return { ...medication, recordId: newRecord.id };
          }),
        });
      }
    });

    res.status(201).json(record);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function deleteRecord(req: Request, res: Response) {
  try {
    const recordId = req.params.id as string;

    await prisma.$transaction([
      prisma.vitalSigns.delete({ where: { recordId } }),
      prisma.recordMedication.deleteMany({ where: { recordId } }),
      prisma.record.delete({
        where: { id: recordId },
      }),
    ]);

    res.status(200).json({ message: "Record deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export async function updateRecord(req: Request, res: Response) {
  try {
    const { symptoms, signs, diagnosis, vitalSigns, recordMedications } =
      req.body;

    console.log("Record Medications:");
    console.log(recordMedications);

    const updatedRecord = await prisma.$transaction(async (tx) => {
      await tx.record.update({
        where: { id: req.params.id as string },
        data: { symptoms, signs, diagnosis },
      });

      if (recordMedications) {
        // fix update record medication
        await tx.recordMedication.deleteMany({
          where: { recordId: req.params.id as string },
        });

        await tx.recordMedication.createMany({
          data: recordMedications.map(
            (medication: CreateRecordMedicationInput) => {
              return { ...medication, recordId: req.params.id as string };
            },
          ),
        });
      }
      if (vitalSigns) {
        await tx.vitalSigns.update({
          where: { recordId: req.params.id as string },
          data: vitalSigns,
        });
      }
    });

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}
