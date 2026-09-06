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
    signatures
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
    prisma.signature.findMany()
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
      signatures
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

  for (const signature of signatures) {
    if (!signature.filePath) continue;

    const absolutePath = path.resolve(signature.filePath);

    if (fs.existsSync(absolutePath)) {
      archive.file(absolutePath, {
        name: `signatures/${path.basename(absolutePath)}`,
      });
    } else {
      console.warn("Missing signature file:", absolutePath);
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

function parseDates(items: any[], dateKeys: string[]): any[] {
  return items.map((item) => {
    const copy: Record<string, any> = { ...item };
    for (const key of dateKeys) {
      if (copy[key]) {
        copy[key] = new Date(copy[key]);
      }
    }
    return copy;
  });
}

function findBackupFile(dirPath: string): string | null {
  const directPath = path.join(dirPath, "backup.json");
  if (fs.existsSync(directPath)) return directPath;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const nestedPath = path.join(dirPath, entry.name, "backup.json");
      if (fs.existsSync(nestedPath)) return nestedPath;
    }
  }
  return null;
}

function copyDirIfExists(sourceDir: string, destinationDir: string) {
  if (!fs.existsSync(sourceDir)) return;

  fs.mkdirSync(destinationDir, { recursive: true });

  for (const name of fs.readdirSync(sourceDir)) {
    const srcFile = path.join(sourceDir, name);
    const destFile = path.join(destinationDir, name);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

export async function restoreBackup(req: Request, res: Response) {
  const file = req.file;
  let extractDir: string | undefined;

  try {
    if (!file) {
      return res.status(400).json({
        error: "Backup file is required.",
      });
    }

    extractDir = fs.mkdtempSync(path.join(os.tmpdir(), "restore-"));

    const zip = new AdmZip(file.path);
    zip.extractAllTo(extractDir, true);

    const backupPath = findBackupFile(extractDir);

    if (!backupPath) {
      return res.status(400).json({
        error: "Invalid backup file. backup.json was not found.",
      });
    }

    const baseDir = path.dirname(backupPath);
    const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));

    if (backup?.metadata?.app !== "ClinicSync" || !backup?.data) {
      return res.status(400).json({
        error: "Invalid ClinicSync backup file.",
      });
    }

    const {
      users = [],
      clinics = [],
      patients = [],
      cases = [],
      records = [],
      vitalSigns = [],
      recordMedications = [],
      labResults = [],
      systemLogs = [],
      signatures = [],
    } = backup.data;

    const parsedUsers = parseDates(users, ["createdAt"]);
    const parsedClinics = parseDates(clinics, ["createdAt", "updatedAt"]);
    const parsedPatients = parseDates(patients, ["dateOfBirth", "archivedOn", "createdAt", "updatedAt"]);
    const parsedCases = parseDates(cases, ["archivedOn"]);
    const parsedRecords = parseDates(records, ["visitDate", "archivedOn", "createdAt", "updatedAt"]);
    const parsedRecordMedications = parseDates(recordMedications, ["createdAt"]);
    const parsedLabResults = parseDates(labResults, ["uploadedAt"]);
    const parsedSignatures = parseDates(signatures, ["uploadedAt"]);
    const parsedSystemLogs = parseDates(systemLogs, ["createdAt"]);

    await prisma.$transaction(async (tx) => {
      // Clear existing records in reverse foreign-key order
      await tx.systemLogs.deleteMany();
      await tx.signature.deleteMany();
      await tx.labResult.deleteMany();
      await tx.recordMedication.deleteMany();
      await tx.vitalSigns.deleteMany();
      await tx.record.deleteMany();
      await tx.case.deleteMany();
      await tx.patient.deleteMany();
      await tx.clinic.deleteMany();
      await tx.user.deleteMany();

      if (parsedUsers.length) await tx.user.createMany({ data: parsedUsers });
      if (parsedClinics.length) await tx.clinic.createMany({ data: parsedClinics });
      if (parsedPatients.length) await tx.patient.createMany({ data: parsedPatients });
      if (parsedCases.length) await tx.case.createMany({ data: parsedCases });
      if (parsedRecords.length) await tx.record.createMany({ data: parsedRecords });
      if (vitalSigns.length) await tx.vitalSigns.createMany({ data: vitalSigns });
      if (parsedRecordMedications.length) await tx.recordMedication.createMany({ data: parsedRecordMedications });
      if (parsedLabResults.length) await tx.labResult.createMany({ data: parsedLabResults });
      if (parsedSignatures.length) await tx.signature.createMany({ data: parsedSignatures });
      if (parsedSystemLogs.length) await tx.systemLogs.createMany({ data: parsedSystemLogs });
    });

    copyDirIfExists(
      path.join(baseDir, "lab-results"),
      path.join(process.cwd(), "uploads", "lab-results"),
    );
    copyDirIfExists(
      path.join(baseDir, "signatures"),
      path.join(process.cwd(), "uploads", "signatures"),
    );

    return res.status(201).json({ message: "Restore backup successfully." });
  } catch (error: any) {
    console.error("Restore backup error:", error);
    return res.status(400).json({ error: error?.message || "Failed to restore backup." });
  } finally {
    if (extractDir) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
}

export async function importBackup(req: Request, res: Response) {
  const file = req.file;
  let extractDir: string | undefined;

  try {
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      return res.status(403).json({
        error: "Import is only allowed on a fresh setup with no existing users.",
      });
    }

    if (!file) {
      return res.status(400).json({
        error: "Backup file is required.",
      });
    }

    extractDir = fs.mkdtempSync(path.join(os.tmpdir(), "import-"));

    const zip = new AdmZip(file.path);
    zip.extractAllTo(extractDir, true);

    const backupPath = findBackupFile(extractDir);

    if (!backupPath) {
      return res.status(400).json({
        error: "Invalid backup file. backup.json was not found.",
      });
    }

    const baseDir = path.dirname(backupPath);
    const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));

    if (backup?.metadata?.app !== "ClinicSync" || !backup?.data) {
      return res.status(400).json({
        error: "Invalid ClinicSync backup file.",
      });
    }

    const {
      users = [],
      clinics = [],
      patients = [],
      cases = [],
      records = [],
      vitalSigns = [],
      recordMedications = [],
      labResults = [],
      systemLogs = [],
      signatures = [],
    } = backup.data;

    const parsedUsers = parseDates(users, ["createdAt"]);
    const parsedClinics = parseDates(clinics, ["createdAt", "updatedAt"]);
    const parsedPatients = parseDates(patients, ["dateOfBirth", "archivedOn", "createdAt", "updatedAt"]);
    const parsedCases = parseDates(cases, ["archivedOn"]);
    const parsedRecords = parseDates(records, ["visitDate", "archivedOn", "createdAt", "updatedAt"]);
    const parsedRecordMedications = parseDates(recordMedications, ["createdAt"]);
    const parsedLabResults = parseDates(labResults, ["uploadedAt"]);
    const parsedSignatures = parseDates(signatures, ["uploadedAt"]);
    const parsedSystemLogs = parseDates(systemLogs, ["createdAt"]);

    console.log(parsedClinics);

    await prisma.$transaction(async (tx) => {
      if (parsedUsers.length) await tx.user.createMany({ data: parsedUsers });
      if (parsedClinics.length) await tx.clinic.upsert({
        where: { id: "default-clinic-id" },
        update: { ...parsedClinics[0] },
        create: {
          id: "default-clinic-id",
          name: "Clinic",
          address: "Your Address Here",
          phone: "09XX-XXX-XXXX",
        },
      })
      if (parsedPatients.length) await tx.patient.createMany({ data: parsedPatients });
      if (parsedCases.length) await tx.case.createMany({ data: parsedCases });
      if (parsedRecords.length) await tx.record.createMany({ data: parsedRecords });
      if (vitalSigns.length) await tx.vitalSigns.createMany({ data: vitalSigns });
      if (parsedRecordMedications.length) await tx.recordMedication.createMany({ data: parsedRecordMedications });
      if (parsedLabResults.length) await tx.labResult.createMany({ data: parsedLabResults });
      if (parsedSignatures.length) await tx.signature.createMany({ data: parsedSignatures });
      if (parsedSystemLogs.length) await tx.systemLogs.createMany({ data: parsedSystemLogs });
    });

    copyDirIfExists(
      path.join(baseDir, "lab-results"),
      path.join(process.cwd(), "uploads", "lab-results"),
    );
    copyDirIfExists(
      path.join(baseDir, "signatures"),
      path.join(process.cwd(), "uploads", "signatures"),
    );

    return res.status(201).json({ message: "Backup imported successfully." });
  } catch (error: any) {
    console.error("Import backup error:", error);
    return res.status(400).json({
      error: error?.message || "Failed to import backup.",
    });
  } finally {
    if (extractDir) {
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
}

