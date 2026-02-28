import { z } from "zod";

export const createPatientSchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  phone: z.string(),
  address: z.string(),
  sex: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
  }, z.date()),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
