import z from "zod";

const templateTypeEnum = z.enum([
  "GENERAL_CLEARANCE",
  "CONSULTATION_DIAGNOSIS",
  "PRE_EMPLOYMENT_PE",
]);

const jsonFieldSchema = z
  .record(z.string(), z.string().optional())
  .or(z.string())
  .optional()
  .nullable();

export const createMedicalCertificateSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid().optional().nullable(),
  templateType: templateTypeEnum.default("GENERAL_CLEARANCE"),
  certificateDate: z.string().optional(),
  dateSeen: z.string().optional().nullable(),
  reasonForVisit: z.string().optional().nullable(),
  vitalSigns: jsonFieldSchema,
  physicalExam: jsonFieldSchema,
  labResults: jsonFieldSchema,
  fitnessClass: z.string().optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  purpose: z.string().optional().nullable(),
});

export const updateMedicalCertificateSchema = z.object({
  doctorId: z.string().uuid().optional().nullable(),
  templateType: templateTypeEnum.optional(),
  certificateDate: z.string().optional(),
  dateSeen: z.string().optional().nullable(),
  reasonForVisit: z.string().optional().nullable(),
  vitalSigns: jsonFieldSchema,
  physicalExam: jsonFieldSchema,
  labResults: jsonFieldSchema,
  fitnessClass: z.string().optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
  purpose: z.string().optional().nullable(),
});
