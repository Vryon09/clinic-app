export type ServiceCategory =
  | "CONSULTATION"
  | "PROCEDURE"
  | "MEDICATION"
  | "LABORATORY"
  | "SUPPLIES"
  | "OTHER";

export type InvoiceStatus =
  | "DRAFT"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED";

export type DiscountType = "NONE" | "PERCENTAGE" | "FIXED";

export type PaymentMethod =
  | "CASH"
  | "GCASH"
  | "MAYA"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "HMO_INSURANCE"
  | "OTHER";

export interface IServiceCatalog {
  id: string;
  name: string;
  category: ServiceCategory;
  defaultPrice: number;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IInvoiceItem {
  id?: string;
  invoiceId?: string;
  serviceId?: string | null;
  name: string;
  category: ServiceCategory;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface IPayment {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  patientId: string;
  receivedById: string;
  receivedBy?: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
  };
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string | null;
  paymentDate: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    address: string;
  };
  invoice?: IInvoice;
}

export interface IInvoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patient?: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    address?: string;
  };
  recordId?: string | null;
  record?: {
    id: string;
    visitDate: string;
    diagnosis?: string | null;
    case?: {
      caseName: string;
      doctor?: {
        id: string;
        firstName: string;
        middleName: string;
        lastName: string;
        licenseNum?: string | null;
      } | null;
    };
  } | null;
  createdById: string;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  issueDate: string;
  dueDate?: string | null;
  status: InvoiceStatus;
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  discountReason?: string | null;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  notes?: string | null;
  items: IInvoiceItem[];
  payments: IPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface IBillingSummary {
  totalBilled: number;
  totalCollected: number;
  totalOutstanding: number;
  collectedToday: number;
  paymentsTodayCount: number;
  unpaidCount: number;
  partialCount: number;
  paidCount: number;
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  status?: string;
  patientId?: string;
  recordId?: string;
  search?: string;
}

export interface CreateInvoicePayload {
  patientId: string;
  recordId?: string | null;
  issueDate?: string;
  dueDate?: string | null;
  status?: "DRAFT" | "UNPAID";
  discountType: DiscountType;
  discountValue: number;
  discountReason?: string | null;
  taxRate: number;
  notes?: string | null;
  items: Array<{
    serviceId?: string | null;
    name: string;
    category: ServiceCategory;
    unitPrice: number;
    quantity: number;
  }>;
}

export interface RecordPaymentPayload {
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string | null;
  paymentDate?: string;
  notes?: string | null;
}
