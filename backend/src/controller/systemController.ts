import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import fs from "fs";

export async function resetDatabase(req: Request, res: Response) {
  try {
    await prisma.$transaction(async (tx) => {
      const labResults = await tx.labResult.findMany({
        select: { filePath: true },
      });

      for (const labResult of labResults) {
        try {
          await fs.promises.unlink(labResult.filePath);
        } catch {
          console.log("Lab result not found.");
        }
      }

      await tx.recordMedication.deleteMany();
      await tx.vitalSigns.deleteMany();
      await tx.record.deleteMany();
      await tx.case.deleteMany();
      await tx.labResult.deleteMany();
      await tx.patient.deleteMany();

      await tx.systemLogs.deleteMany();
      await tx.googleToken.deleteMany();
      await tx.clinic.deleteMany();

      await tx.clinic.upsert({
        where: {
          id: "default-clinic-id",
        },
        update: {},
        create: {
          id: "default-clinic-id",
          name: "Clinic",
          address: "Your Address Here",
          phone: "09XX-XXX-XXXX",
        },
      });

      await tx.user.deleteMany();
    });

    return res.status(200).json({
      success: true,
      message: "Database has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset database error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset database.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
