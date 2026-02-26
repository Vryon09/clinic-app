import { z } from "zod";

export const createPatientSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  age: z.preprocess(
    (val) => (val !== undefined ? Number(val) : undefined),
    z.number(),
  ),
  phone: z.string(),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
