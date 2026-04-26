import { z } from "zod";

export const createClinicInfo = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Clinic name is required")
    .max(50, "Clinic name must not exceed 50 characters."),

  address: z
    .string()
    .trim()
    .min(1, "Address is required.")
    .max(150, "Address must not exceed 150 characters."),

  contactNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(
      /^09\d{9}$/,
      "Phone number must be exactly 11 digits and start with 09.",
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
});
