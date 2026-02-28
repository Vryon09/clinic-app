import { z } from "zod";

export const createRecordSchema = z.object({
  // patientId: z
  //   .uuid("Invalid patient reference.")
  //   .min(1, "Patient reference is required."),

  chiefComplaint: z
    .string()
    .trim()
    .max(500, "Chief complaint must not exceed 500 characters.")
    .optional(),

  diagnosis: z
    .string()
    .trim()
    .max(500, "Diagnosis must not exceed 500 characters.")
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000, "Notes must not exceed 2000 characters.")
    .optional(),
});

export const updateRecordSchema = createRecordSchema.partial();

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
