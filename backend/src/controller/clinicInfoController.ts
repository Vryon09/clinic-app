import { Request, Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";
import { UpdateClinicInfoType } from "../schemas/clinicInfoSchema";
import fs from "node:fs";
import path from "node:path";

export async function initClinicInfo(req: Request, res: Response) {
  try {
    const initialClinicInfo = await prisma.clinic.upsert({
      where: { id: "default-clinic-id" },
      update: {},
      create: {
        id: "default-clinic-id",
        name: "Clinic",
        address: "Your Address Here",
        phone: "09XX-XXX-XXXX",
      },
    })

    if (!initialClinicInfo) {
      res.status(400).json({ message: "Cannot initialize clinic info" });
      return;
    }

    res.status(201).json(initialClinicInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getClinicInfo(req: Request, res: Response) {
  try {
    const clinic = await prisma.clinic.findFirst();

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    return res.json(clinic);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateClinicInfo(req: UserRequest, res: Response) {
  try {
    const data: UpdateClinicInfoType = req.body;

    const clinic = await prisma.clinic.findFirst();

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const updated = await prisma.clinic.update({
      where: { id: clinic.id },
      data: { ...data, lastEditedById: req.userId },
    });

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "General Settings",
        target: `${updated.name}`,
        details: "Updated clinic information",
        userId: req.userId!,
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: "Invalid input", error });
  }
}

export async function uploadClinicLogo(req: UserRequest, res: Response) {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const clinic = await prisma.clinic.findFirst();
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found." });
    }

    // Single logo constraint: Replace existing logo by unlinking previous file
    if (clinic.logoPath) {
      try {
        const oldResolved = path.resolve(process.cwd(), clinic.logoPath);
        if (fs.existsSync(oldResolved)) {
          fs.unlinkSync(oldResolved);
        }
      } catch (unlinkErr) {
        console.warn("Failed to delete previous logo:", unlinkErr);
      }
    }

    const normalizedPath = filePath.replace(/\\/g, "/");

    const updated = await prisma.clinic.update({
      where: { id: clinic.id },
      data: {
        logoPath: normalizedPath,
        lastEditedById: req.userId,
      },
    });

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "General Settings",
        target: `${updated.name}`,
        details: "Uploaded clinic logo",
        userId: req.userId!,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("uploadClinicLogo error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}

export async function deleteClinicLogo(req: UserRequest, res: Response) {
  try {
    const clinic = await prisma.clinic.findFirst();
    if (!clinic || !clinic.logoPath) {
      return res.status(404).json({ message: "No logo found to delete." });
    }

    try {
      const oldResolved = path.resolve(process.cwd(), clinic.logoPath);
      if (fs.existsSync(oldResolved)) {
        fs.unlinkSync(oldResolved);
      }
    } catch (unlinkErr) {
      console.warn("Failed to delete logo file:", unlinkErr);
    }

    const updated = await prisma.clinic.update({
      where: { id: clinic.id },
      data: {
        logoPath: null,
        lastEditedById: req.userId,
      },
    });

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "General Settings",
        target: `${updated.name}`,
        details: "Deleted clinic logo",
        userId: req.userId!,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("deleteClinicLogo error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}
