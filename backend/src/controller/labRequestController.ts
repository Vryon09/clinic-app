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

export async function getLabRequestsByPatient(req: UserRequest, res: Response) {
  try {
    const { patientId } = req.params as { patientId: string };
    const page = Math.max(1, parseInt(req.query.page as string)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit as string)) || 10;
    const skip = (page - 1) * limit;

    const where = { patientId };

    const [labRequests, total] = await prisma.$transaction([
      prisma.labRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ requestDate: "desc" }, { createdAt: "desc" }],
        include: {
          doctor: { select: DOCTOR_SELECT },
        },
      }),
      prisma.labRequest.count({ where }),
    ]);

    return res.status(200).json({
      data: labRequests,
      success: true,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch lab requests:", error);
    return res.status(500).json({ message: "Failed to retrieve lab requests." });
  }
}

export async function getLabRequestById(req: UserRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };

    const labRequest = await prisma.labRequest.findUnique({
      where: { id },
      include: {
        doctor: { select: DOCTOR_SELECT },
        patient: true,
      },
    });

    if (!labRequest) {
      return res.status(404).json({ message: "Lab request not found." });
    }

    return res.status(200).json(labRequest);
  } catch (error) {
    console.error("Failed to fetch lab request:", error);
    return res.status(500).json({ message: "Failed to retrieve lab request." });
  }
}

export async function createLabRequest(req: UserRequest, res: Response) {
  try {
    const {
      patientId,
      doctorId,
      requestDate,
      selectedTests,
      customTests,
      otherExaminations,
      notes,
    } = req.body;

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: { id: true, firstName: true, lastName: true },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    const serializedTests = serializeJsonField(selectedTests) ?? "{}";
    const serializedCustom = serializeJsonField(customTests);

    const newRequest = await prisma.labRequest.create({
      data: {
        patientId,
        doctorId: doctorId || null,
        requestDate: requestDate ? new Date(requestDate) : new Date(),
        selectedTests: serializedTests,
        customTests: serializedCustom,
        otherExaminations: otherExaminations || null,
        notes: notes || null,
      },
      include: {
        doctor: { select: DOCTOR_SELECT },
      },
    });

    await prisma.systemLogs.create({
      data: {
        action: "CREATE",
        module: "Laboratory",
        target: `${patient.firstName} ${patient.lastName}`,
        details: `Created laboratory request for ${patient.firstName} ${patient.lastName}`,
        userId: req.userId!,
      },
    });

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error("Failed to create lab request:", error);
    return res.status(400).json({ message: "Failed to create lab request." });
  }
}

export async function updateLabRequest(req: UserRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const {
      doctorId,
      requestDate,
      selectedTests,
      customTests,
      otherExaminations,
      notes,
    } = req.body;

    const existing = await prisma.labRequest.findUnique({
      where: { id },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Lab request not found." });
    }

    const updated = await prisma.labRequest.update({
      where: { id },
      data: {
        ...(doctorId !== undefined ? { doctorId: doctorId || null } : {}),
        ...(requestDate !== undefined ? { requestDate: new Date(requestDate) } : {}),
        ...(selectedTests !== undefined
          ? { selectedTests: serializeJsonField(selectedTests) ?? "{}" }
          : {}),
        ...(customTests !== undefined
          ? { customTests: serializeJsonField(customTests) }
          : {}),
        ...(otherExaminations !== undefined
          ? { otherExaminations: otherExaminations || null }
          : {}),
        ...(notes !== undefined ? { notes: notes || null } : {}),
      },
      include: {
        doctor: { select: DOCTOR_SELECT },
      },
    });

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "Laboratory",
        target: `${existing.patient.firstName} ${existing.patient.lastName}`,
        details: `Updated laboratory request for ${existing.patient.firstName} ${existing.patient.lastName}`,
        userId: req.userId!,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Failed to update lab request:", error);
    return res.status(400).json({ message: "Failed to update lab request." });
  }
}

export async function deleteLabRequest(req: UserRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };

    const existing = await prisma.labRequest.findUnique({
      where: { id },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Lab request not found." });
    }

    await prisma.labRequest.delete({ where: { id } });

    await prisma.systemLogs.create({
      data: {
        action: "DELETE",
        module: "Laboratory",
        target: `${existing.patient.firstName} ${existing.patient.lastName}`,
        details: `Deleted laboratory request for ${existing.patient.firstName} ${existing.patient.lastName}`,
        userId: req.userId!,
      },
    });

    return res.status(200).json({ message: "Lab request deleted." });
  } catch (error) {
    console.error("Failed to delete lab request:", error);
    return res.status(500).json({ message: "Failed to delete lab request." });
  }
}
