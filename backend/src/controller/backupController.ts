// backend/src/controllers/backup.controller.ts
import { Request, Response } from "express";
import { google } from "googleapis";
import { Readable } from "stream";
import { oauth2Client } from "../config/google.config";
import { prisma } from "../config/prisma";
import os from "os";
import path from "path";
import fs from "fs";
import { ZipArchive } from "archiver";

export const backupToDrive = async (req: Request, res: Response) => {
  const tokenRecord = await prisma.googleToken.findUnique({ where: { id: 1 } });
  if (!tokenRecord) {
    return res.status(400).json({
      error: "Google Drive not connected. Please authenticate first.",
    });
  }

  oauth2Client.setCredentials({ refresh_token: tokenRecord.refreshToken });

  const [
    clinics,
    users,
    patients,
    cases,
    records,
    vitalSigns,
    recordMedications,
    labResults,
    systemLogs,
  ] = await prisma.$transaction([
    prisma.clinic.findMany(),
    prisma.user.findMany(),
    prisma.patient.findMany(),
    prisma.case.findMany(),
    prisma.record.findMany(),
    prisma.vitalSigns.findMany(),
    prisma.recordMedication.findMany(),
    prisma.labResult.findMany(),
    prisma.systemLogs.findMany(),
  ]);

  const backup = {
    metadata: {
      app: "ClinicSync",
      version: "1.0",
      exportedAt: new Date().toISOString(),
    },

    data: {
      clinics,
      users,
      patients,
      cases,
      records,
      vitalSigns,
      recordMedications,
      labResults,
      systemLogs,
    },
  };

  const zipName = `ClinicSync_Backup_${Date.now()}.zip`;
  const zipPath = path.join(os.tmpdir(), zipName);

  const output = fs.createWriteStream(zipPath);

  const archive = new ZipArchive({
    zlib: { level: 9 },
  });

  archive.pipe(output);

  archive.append(JSON.stringify(backup, null, 2), {
    name: "backup.json",
  });

  for (const lab of labResults) {
    if (!lab.filePath) continue;

    const absolutePath = path.resolve(lab.filePath);

    if (fs.existsSync(absolutePath)) {
      archive.file(absolutePath, {
        name: `labresults/${path.basename(absolutePath)}`,
      });
    } else {
      console.warn("Missing lab file:", absolutePath);
    }
  }

  await archive.finalize();

  await new Promise<void>((resolve, reject) => {
    output.on("close", () => resolve());
    output.on("error", reject);
  });

  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // 8. Upload to Google Drive
  const upload = await drive.files.create({
    requestBody: {
      name: zipName,
      mimeType: "application/zip",
    },

    media: {
      mimeType: "application/zip",
      body: fs.createReadStream(zipPath),
    },

    fields: "id,name",
  });

  fs.unlinkSync(zipPath);

  return res.json({
    success: true,
    fileId: upload.data.id,
    fileName: upload.data.name,
  });
};
