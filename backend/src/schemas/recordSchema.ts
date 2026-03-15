import { z } from "zod";
import { createVitalSignsSchema } from "./vitalSignsSchema";

export const createRecordSchema = z.object({
  patientId: z.uuid(),

  symptoms: z
    .string()
    .trim()
    .max(500, "Symptoms must not exceed 500 characters.")
    .optional(),

  signs: z
    .string()
    .trim()
    .max(500, "Symptoms must not exceed 500 characters.")
    .optional(),

  diagnosis: z
    .string()
    .trim()
    .max(500, "Diagnosis must not exceed 500 characters.")
    .optional(),

  vitalSigns: createVitalSignsSchema.optional(),
});

export const updateRecordSchema = createRecordSchema.partial();

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
