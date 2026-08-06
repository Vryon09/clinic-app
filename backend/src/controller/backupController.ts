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
import AdmZip from "adm-zip";

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
        name: `lab-results/${path.basename(absolutePath)}`,
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

export async function restoreBackup(req: Request, res: Response) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "Backup file is required.",
      });
    }

    const zipPath = file.path;

    const extractDir = fs.mkdtempSync(path.join(os.tmpdir(), "restore-"));

    const zip = new AdmZip(zipPath);

    zip.extractAllTo(extractDir, true);

    const backupPath = path.join(extractDir, "backup.json");

    const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));

    await prisma.$transaction(async (tx) => {
      await tx.clinic.deleteMany();

      if (backup.data.users.length) {
        await tx.user.createMany({
          data: backup.data.users,
        });
      }
      if (backup.data.clinics.length) {
        await tx.clinic.createMany({
          data: backup.data.clinics,
        });
      }
      if (backup.data.patients.length) {
        await tx.patient.createMany({
          data: backup.data.patients,
        });
      }

      if (backup.data.cases.length) {
        await tx.case.createMany({
          data: backup.data.cases,
        });
      }
      if (backup.data.records.length) {
        await tx.record.createMany({
          data: backup.data.records,
        });
      }

      if (backup.data.vitalSigns.length) {
        await tx.vitalSigns.createMany({
          data: backup.data.vitalSigns,
        });
      }
      if (backup.data.recordMedications.length) {
        await tx.recordMedication.createMany({
          data: backup.data.recordMedications,
        });
      }

      if (backup.data.labResults.length) {
        await tx.labResult.createMany({
          data: backup.data.labResults,
        });
      }

      if (backup.data.systemLogs.length) {
        await tx.systemLogs.createMany({
          data: backup.data.systemLogs,
        });
      }
    });

    const sourceDir = path.join(extractDir, "lab-results");

    const destinationDir = path.join(process.cwd(), "uploads", "lab-results");

    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, {
        recursive: true,
      });
    }

    for (const file of fs.readdirSync(sourceDir)) {
      fs.copyFileSync(
        path.join(sourceDir, file),
        path.join(destinationDir, file),
      );
    }

    fs.rmSync(extractDir, {
      recursive: true,
      force: true,
    });

    fs.unlinkSync(zipPath);

    res.status(201).json({ message: "Restore backup successfully." });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
