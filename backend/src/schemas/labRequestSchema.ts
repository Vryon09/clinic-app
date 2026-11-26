import z from "zod";

const selectedTestsSchema = z.record(z.string(), z.array(z.string())).or(z.string());
const customTestsSchema = z.record(z.string(), z.string()).or(z.string()).optional().nullable();

export const createLabRequestSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid().optional().nullable(),
  requestDate: z.string().optional(),
  selectedTests: selectedTestsSchema,
  customTests: customTestsSchema,
  otherExaminations: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateLabRequestSchema = z.object({
  doctorId: z.string().uuid().optional().nullable(),
  requestDate: z.string().optional(),
  selectedTests: selectedTestsSchema.optional(),
  customTests: customTestsSchema,
  otherExaminations: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});
