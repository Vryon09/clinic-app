import { z } from "zod";

export const ServiceCategoryEnum = z.enum([
  "CONSULTATION",
  "PROCEDURE",
  "MEDICATION",
  "LABORATORY",
  "SUPPLIES",
  "OTHER",
]);

export const InvoiceStatusEnum = z.enum([
  "DRAFT",
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "CANCELLED",
]);

export const DiscountTypeEnum = z.enum(["NONE", "PERCENTAGE", "FIXED"]);

export const PaymentMethodEnum = z.enum([
  "CASH",
  "GCASH",
  "MAYA",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
  "HMO_INSURANCE",
  "OTHER",
]);

export const createServiceSchema = z.object({
  name: z.string().min(1, "Service name is required").max(150),
  category: ServiceCategoryEnum.default("CONSULTATION"),
  defaultPrice: z.number().min(0, "Price must be zero or positive"),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export const invoiceItemSchema = z.object({
  serviceId: z.string().optional().nullable(),
  name: z.string().min(1, "Item name is required"),
  category: ServiceCategoryEnum.default("OTHER"),
  unitPrice: z.number().min(0, "Unit price must be zero or positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

export const createInvoiceSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  recordId: z.string().optional().nullable(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "UNPAID"]).optional().default("UNPAID"),
  discountType: DiscountTypeEnum.default("NONE"),
  discountValue: z.number().min(0).default(0),
  discountReason: z.string().optional().nullable(),
  taxRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1, "At least one invoice item is required"),
});

export const updateInvoiceSchema = z.object({
  dueDate: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "UNPAID"]).optional(),
  discountType: DiscountTypeEnum.optional(),
  discountValue: z.number().min(0).optional(),
  discountReason: z.string().optional().nullable(),
  taxRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1).optional(),
});

export const recordPaymentSchema = z.object({
  amount: z.number().positive("Payment amount must be greater than zero"),
  paymentMethod: PaymentMethodEnum.default("CASH"),
  referenceNumber: z.string().optional().nullable(),
  paymentDate: z.string().optional(),
  notes: z.string().optional().nullable(),
});
