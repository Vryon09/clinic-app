import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must not exceed 50 characters."),

  middleName: z
    .string()
    .trim()
    .min(1, "Middle name is required.")
    .max(50, "Middle name must not exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must not exceed 50 characters."),

  username: z.string().min(1, "Username is required."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  role: z.enum(["ADMIN", "DOCTOR", "ASSISTANT"]).default("ASSISTANT"),
});

export const addUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50, "First name must not exceed 50 characters."),

  middleName: z
    .string()
    .trim()
    .min(1, "Middle name is required.")
    .max(50, "Middle name must not exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50, "Last name must not exceed 50 characters."),

  username: z.string().min(1, "Username is required."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  licenseNum: z
    .string()
    .regex(/^\d{7}$/, {
      message: "Must be exactly 7 digits",
    })
    .or(z.literal("")),

  role: z.enum(["ADMIN", "DOCTOR", "ASSISTANT"]).default("ASSISTANT"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),

  password: z.string().min(1, "Password is required"),
});
