import { Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";

const DOCTOR_SELECT = {
  id: true,
  firstName: true,
  middleName: true,
  lastName: true,
  role: true,
  licenseNum: true,
};

function serializeJsonField(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export async function getMedicalCertificatesByPatient(
  req: UserRequest,
  res: Response,
) {
  try {
    const { patientId } = req.params as { patientId: string };
    const page = Math.max(1, parseInt(req.query.page as string)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit as string)) || 10;
    const skip = (page - 1) * limit;

    const where = { patientId };

    const [certificates, total] = await prisma.$transaction([
      prisma.medicalCertificate.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ certificateDate: "desc" }, { createdAt: "desc" }],
        include: {
          doctor: { select: DOCTOR_SELECT },
        },
      }),
      prisma.medicalCertificate.count({ where }),
    ]);

    return res.status(200).json({
      data: certificates,
      success: true,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch medical certificates:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve medical certificates." });
  }
}

export async function getMedicalCertificateById(
  req: UserRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };

    const certificate = await prisma.medicalCertificate.findUnique({
      where: { id },
      include: {
        doctor: { select: DOCTOR_SELECT },
        patient: true,
      },
    });

    if (!certificate) {
      return res
        .status(404)
        .json({ message: "Medical certificate not found." });
    }

    return res.status(200).json(certificate);
  } catch (error) {
    console.error("Failed to fetch medical certificate:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve medical certificate." });
  }
}

export async function createMedicalCertificate(
  req: UserRequest,
  res: Response,
) {
  try {
    const {
      patientId,
      doctorId,
      templateType,
      certificateDate,
      dateSeen,
      reasonForVisit,
      vitalSigns,
      physicalExam,
      labResults,
      fitnessClass,
      diagnosis,
      remarks,
      purpose,
    } = req.body;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const newCertificate = await prisma.medicalCertificate.create({
      data: {
        patientId,
        doctorId: doctorId || null,
        templateType: templateType || "GENERAL_CLEARANCE",
        certificateDate: certificateDate
          ? new Date(certificateDate)
          : new Date(),
        dateSeen: dateSeen ? new Date(dateSeen) : null,
        reasonForVisit: reasonForVisit || null,
        vitalSigns: serializeJsonField(vitalSigns),
        physicalExam: serializeJsonField(physicalExam),
        labResults: serializeJsonField(labResults),
        fitnessClass: fitnessClass || null,
        diagnosis: diagnosis || null,
        remarks: remarks || null,
        purpose: purpose || null,
      },
      include: {
        doctor: { select: DOCTOR_SELECT },
      },
    });

    await prisma.systemLogs.create({
      data: {
        action: "CREATE",
        module: "Medical Certificate",
        target: `${patient.firstName} ${patient.lastName}`,
        details: `Created medical certificate (${newCertificate.templateType}) for ${patient.firstName} ${patient.lastName}`,
        userId: req.userId!,
      },
    });

    return res.status(201).json(newCertificate);
  } catch (error) {
    console.error("Failed to create medical certificate:", error);
    return res
      .status(400)
      .json({ message: "Failed to create medical certificate." });
  }
}

export async function updateMedicalCertificate(
  req: UserRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };
    const {
      doctorId,
      templateType,
      certificateDate,
      dateSeen,
      reasonForVisit,
      vitalSigns,
      physicalExam,
      labResults,
      fitnessClass,
      diagnosis,
      remarks,
      purpose,
    } = req.body;

    const existing = await prisma.medicalCertificate.findUnique({
      where: { id },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Medical certificate not found." });
    }

    const updated = await prisma.medicalCertificate.update({
      where: { id },
      data: {
        ...(doctorId !== undefined ? { doctorId: doctorId || null } : {}),
        ...(templateType !== undefined ? { templateType } : {}),
        ...(certificateDate !== undefined
          ? { certificateDate: new Date(certificateDate) }
          : {}),
        ...(dateSeen !== undefined
          ? { dateSeen: dateSeen ? new Date(dateSeen) : null }
          : {}),
        ...(reasonForVisit !== undefined
          ? { reasonForVisit: reasonForVisit || null }
          : {}),
        ...(vitalSigns !== undefined
          ? { vitalSigns: serializeJsonField(vitalSigns) }
          : {}),
        ...(physicalExam !== undefined
          ? { physicalExam: serializeJsonField(physicalExam) }
          : {}),
        ...(labResults !== undefined
          ? { labResults: serializeJsonField(labResults) }
          : {}),
        ...(fitnessClass !== undefined
          ? { fitnessClass: fitnessClass || null }
          : {}),
        ...(diagnosis !== undefined ? { diagnosis: diagnosis || null } : {}),
        ...(remarks !== undefined ? { remarks: remarks || null } : {}),
        ...(purpose !== undefined ? { purpose: purpose || null } : {}),
      },
      include: {
        doctor: { select: DOCTOR_SELECT },
      },
    });

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "Medical Certificate",
        target: `${existing.patient.firstName} ${existing.patient.lastName}`,
        details: `Updated medical certificate for ${existing.patient.firstName} ${existing.patient.lastName}`,
        userId: req.userId!,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Failed to update medical certificate:", error);
    return res
      .status(400)
      .json({ message: "Failed to update medical certificate." });
  }
}

export async function deleteMedicalCertificate(
  req: UserRequest,
  res: Response,
) {
  try {
    const { id } = req.params as { id: string };

    const existing = await prisma.medicalCertificate.findUnique({
      where: { id },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "Medical certificate not found." });
    }

    await prisma.medicalCertificate.delete({ where: { id } });

    await prisma.systemLogs.create({
      data: {
        action: "DELETE",
        module: "Medical Certificate",
        target: `${existing.patient.firstName} ${existing.patient.lastName}`,
        details: `Deleted medical certificate for ${existing.patient.firstName} ${existing.patient.lastName}`,
        userId: req.userId!,
      },
    });

    return res.status(200).json({ message: "Medical certificate deleted." });
  } catch (error) {
    console.error("Failed to delete medical certificate:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete medical certificate." });
  }
}
