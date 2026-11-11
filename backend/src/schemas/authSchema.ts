import { z } from "zod";

const nameField = (fieldLabel: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldLabel} is required.`)
    .max(50, `${fieldLabel} must not exceed 50 characters.`)
    .regex(/^[^\d]+$/, `${fieldLabel} cannot contain numbers.`);

const optionalMiddleNameField = z
  .string()
  .trim()
  .max(50, "Middle name must not exceed 50 characters.")
  .regex(/^[^\d]*$/, "Middle name cannot contain numbers.")
  .optional()
  .or(z.literal(""));

const usernameField = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must not exceed 30 characters.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores.",
  )
  .refine(
    (val) => !/^\d+$/.test(val),
    "Username cannot consist only of numbers.",
  );

export const registerSchema = z.object({
  firstName: nameField("First name"),

  middleName: optionalMiddleNameField,

  lastName: nameField("Last name"),

  username: usernameField,

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),

  role: z.enum(["ADMIN", "DOCTOR", "ASSISTANT"]).default("ASSISTANT"),
});

export const addUserSchema = z.object({
  firstName: nameField("First name"),

  middleName: optionalMiddleNameField,

  lastName: nameField("Last name"),

  username: usernameField,

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters")
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

export const updateUsernameSchema = z.object({
  username: usernameField,
});

export const updateFullNameSchema = z.object({
  firstName: nameField("First name"),
  middleName: optionalMiddleNameField,
  lastName: nameField("Last name"),
});
