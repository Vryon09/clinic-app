import { z } from "zod";

export const createPatientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must not exceed 50 characters.")
    .regex(/^[^\d]+$/, "First name cannot contain numbers."),

  middleName: z
    .string()
    .trim()
    .max(50, "Middle name must not exceed 50 characters.")
    .regex(/^[^\d]*$/, "Middle name cannot contain numbers.")
    .optional()
    .or(z.literal("")),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must not exceed 50 characters.")
    .regex(/^[^\d]+$/, "Last name cannot contain numbers."),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(
      /^09\d{9}$/,
      "Phone number must be exactly 11 digits and start with 09.",
    ),

  address: z
    .string()
    .trim()
    .min(1, "Address is required.")
    .max(150, "Address must not exceed 150 characters.")
    .refine(
      (val) => !/^\d+$/.test(val.replace(/[\s,.-]/g, "")),
      "Address cannot be all numbers.",
    ),

  sex: z.enum(["MALE", "FEMALE"]),

  dateOfBirth: z
    .date()
    .max(new Date(), "Date of birth cannot be in the future."),

  allergies: z
    .string()
    .trim()
    .max(300, "Allergies must not exceed 300 characters.")
    .refine(
      (val) => !val || !/^\d+$/.test(val.replace(/[\s,.-]/g, "")),
      "Allergies cannot be all numbers.",
    )
    .optional()
    .or(z.literal("")),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
