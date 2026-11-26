import type {
  InvoiceStatus,
  PaymentMethod,
  ServiceCategory,
} from "@/types/BillingType";

export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-border",
  },
  UNPAID: {
    label: "Unpaid",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  PARTIALLY_PAID: {
    label: "Partial",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  PAID: {
    label: "Paid",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Cash",
  GCASH: "GCash",
  MAYA: "Maya",
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  BANK_TRANSFER: "Bank Transfer",
  HMO_INSURANCE: "HMO / Insurance",
  OTHER: "Other",
};

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  CONSULTATION: "Consultation",
  PROCEDURE: "Procedure",
  MEDICATION: "Medication",
  LABORATORY: "Laboratory",
  SUPPLIES: "Supplies",
  OTHER: "Other",
};
