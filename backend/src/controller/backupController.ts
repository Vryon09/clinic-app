// backend/src/controllers/backup.controller.ts
import { Request, Response } from "express";
import { google } from "googleapis";
import { Readable } from "stream";
import { oauth2Client } from "../config/google.config";
import { prisma } from "../config/prisma";

export const backupToDrive = async (req: Request, res: Response) => {
  // 1. Get stored refresh token
  const tokenRecord = await prisma.googleToken.findUnique({ where: { id: 1 } });
  if (!tokenRecord) {
    return res.status(400).json({
      error: "Google Drive not connected. Please authenticate first.",
    });
  }

  // 2. Set credentials on the OAuth client
  oauth2Client.setCredentials({ refresh_token: tokenRecord.refreshToken });

  // 3. Query all patient data with nested records
  const patients = await prisma.patient.findMany({
    include: {
      labResults: true,

      records: {
        include: {
          vitalSigns: true,
          recordMedications: true,
        },
      },
    },
  });

  // 4. Build the backup payload
  const backup = {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    totalPatients: patients.length,
    patients,
  };

  // 5. Serialize to JSON
  const json = JSON.stringify(backup, null, 2);

  // 6. Create Drive client
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // 7. Name the file with today's date
  const fileName = `clinicsync-backup-${new Date().toISOString().slice(0, 10)}.json`;

  // 8. Upload to Google Drive
  await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: "application/json",
    },
    media: {
      mimeType: "application/json",
      body: Readable.from([json]),
    },
  });

  return res.json({ success: true, fileName });
};
