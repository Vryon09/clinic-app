import { z } from "zod";
import { createVitalSignsSchema } from "./vitalSignsSchema";
import {
  createRecordMedicationSchema,
  medicationInputSchema,
} from "./recordMedication";

export const createRecordSchema = z.object({
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

  medicationInput: medicationInputSchema,

  recordMedications: z.array(createRecordMedicationSchema).default([]),
});

export const updateRecordSchema = createRecordSchema.partial();

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
