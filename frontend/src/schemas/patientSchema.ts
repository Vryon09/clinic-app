import { z } from "zod";

export const createPatientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must not exceed 50 characters."),

  middleName: z
    .string()
    .trim()
    .max(50, "Middle name must not exceed 50 characters.")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must not exceed 50 characters."),

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
    .max(150, "Address must not exceed 150 characters."),

  sex: z.enum(["MALE", "FEMALE"]),

  dateOfBirth: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim() !== "") {
        return new Date(val);
      }
      return undefined;
    },
    z.date().max(new Date(), "Date of birth cannot be in the future."),
  ),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
