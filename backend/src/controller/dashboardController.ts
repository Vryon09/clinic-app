import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const range = (req.query.range as string) || "30d";
    let days = 30;
    if (range === "7d") days = 7;
    else if (range === "90d") days = 90;

    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const [
      activePatientsCount,
      newPatientsInRange,
      activeCasesCount,
      recordsTodayCount,
      recordsInRange,
      labResultsInRange,
      totalLabResultsCount,
      malePatients,
      femalePatients,
      patientsWithAllergies,
      patientsDemographics,
      casesByDoctor,
    ] = await Promise.all([
      // 1. KPI Counts
      prisma.patient.count({ where: { isArchived: false } }),
      prisma.patient.count({
        where: { isArchived: false, createdAt: { gte: startDate } },
      }),
      prisma.case.count({
        where: { isArchived: false, caseName: { not: "Default" } },
      }),
      prisma.record.count({
        where: { isArchived: false, visitDate: { gte: startOfToday } },
      }),
      prisma.record.findMany({
        where: {
          isArchived: false,
          visitDate: { gte: startDate },
        },
        select: {
          id: true,
          visitDate: true,
          diagnosis: true,
          patientId: true,
        },
      }),
      prisma.labResult.count({
        where: { uploadedAt: { gte: startDate } },
      }),
      prisma.labResult.count(),

      // Demographics
      prisma.patient.count({ where: { isArchived: false, sex: "MALE" } }),
      prisma.patient.count({ where: { isArchived: false, sex: "FEMALE" } }),
      prisma.patient.count({
        where: {
          isArchived: false,
          allergies: { not: null },
        },
      }),
      prisma.patient.findMany({
        where: { isArchived: false },
        select: { dateOfBirth: true },
      }),

      // Cases grouped by doctor
      prisma.case.findMany({
        where: { isArchived: false, doctorId: { not: null } },
        include: {
          doctor: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
    ]);

    // 2. Trend points (daily records in range)
    const trendMap = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      trendMap.set(key, 0);
    }

    recordsInRange.forEach((r) => {
      const key = new Date(r.visitDate).toISOString().split("T")[0];
      if (trendMap.has(key)) {
        trendMap.set(key, (trendMap.get(key) || 0) + 1);
      }
    });

    const consultationTrends = Array.from(trendMap.entries()).map(
      ([date, count]) => ({
        date,
        count,
      }),
    );

    // 3. Top Diagnoses
    const diagnosisCountMap = new Map<string, number>();
    recordsInRange.forEach((r) => {
      if (r.diagnosis && r.diagnosis.trim()) {
        const diag = r.diagnosis.trim();
        diagnosisCountMap.set(diag, (diagnosisCountMap.get(diag) || 0) + 1);
      }
    });
    const topDiagnoses = Array.from(diagnosisCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Top Medications in range
    const medicationsInRange = await prisma.recordMedication.findMany({
      where: {
        record: {
          isArchived: false,
          visitDate: { gte: startDate },
        },
      },
      select: { name: true },
    });

    const medCountMap = new Map<string, number>();
    medicationsInRange.forEach((m) => {
      if (m.name && m.name.trim()) {
        const medName = m.name.trim();
        medCountMap.set(medName, (medCountMap.get(medName) || 0) + 1);
      }
    });
    const topMedications = Array.from(medCountMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 5. Recent Consultations (latest 30 for paginated view)
    const recentConsultations = await prisma.record.findMany({
      where: { isArchived: false },
      orderBy: { visitDate: "desc" },
      take: 30,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        case: {
          select: { id: true, caseName: true },
        },
        createdBy: {
          select: { firstName: true, lastName: true, role: true },
        },
      },
    });

    // 6. Recent Lab Results (latest 5)
    const recentLabResults = await prisma.labResult.findMany({
      orderBy: { uploadedAt: "desc" },
      take: 5,
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    // 7. Demographics Age Buckets
    const ageBuckets = { "0-17": 0, "18-35": 0, "36-59": 0, "60+": 0 };
    const currentYear = now.getFullYear();
    patientsDemographics.forEach((p) => {
      const birthYear = new Date(p.dateOfBirth).getFullYear();
      const age = currentYear - birthYear;
      if (age < 18) ageBuckets["0-17"]++;
      else if (age <= 35) ageBuckets["18-35"]++;
      else if (age <= 59) ageBuckets["36-59"]++;
      else ageBuckets["60+"]++;
    });

    // Cases grouped by doctor count
    const doctorCaseMap = new Map<string, number>();
    casesByDoctor.forEach((c) => {
      if (c.doctor) {
        const docName = `Dr. ${c.doctor.firstName} ${c.doctor.lastName}`.trim();
        doctorCaseMap.set(docName, (doctorCaseMap.get(docName) || 0) + 1);
      }
    });
    const doctorWorkload = Array.from(doctorCaseMap.entries())
      .map(([doctorName, count]) => ({ doctorName, count }))
      .sort((a, b) => b.count - a.count);

    // 8. Admin snapshot (if requested by ADMIN)
    let adminSnapshot = null;
    if (req.user && req.user.role === "ADMIN") {
      const [recentLogs, activeUsersCount, googleToken] = await Promise.all([
        prisma.systemLogs.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            user: { select: { firstName: true, lastName: true, role: true } },
          },
        }),
        prisma.user.count({ where: { isActive: true } }),
        prisma.googleToken.findFirst(),
      ]);

      adminSnapshot = {
        activeUsersCount,
        isGoogleDriveConnected: !!googleToken,
        recentLogs,
      };
    }

    return res.status(200).json({
      kpis: {
        activePatients: activePatientsCount,
        newPatientsInRange,
        activeCases: activeCasesCount,
        recordsToday: recordsTodayCount,
        totalRecordsInRange: recordsInRange.length,
        labResultsInRange,
        totalLabResults: totalLabResultsCount,
      },
      consultationTrends,
      topDiagnoses,
      topMedications,
      recentConsultations,
      recentLabResults,
      demographics: {
        male: malePatients,
        female: femalePatients,
        withAllergies: patientsWithAllergies,
        ageBuckets,
      },
      doctorWorkload,
      adminSnapshot,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
