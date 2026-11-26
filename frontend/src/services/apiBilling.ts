import api from "@/lib/api";
import type {
  CreateInvoicePayload,
  IBillingSummary,
  IInvoice,
  IPayment,
  IServiceCatalog,
  InvoiceFilters,
  RecordPaymentPayload,
  ServiceCategory,
} from "@/types/BillingType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ── API FUNCTIONS ────────────────────────────────────────────────────────────

export const handleGetBillingSummary = async (): Promise<IBillingSummary> => {
  const res = await api.get("/api/billing/summary");
  return res.data.data;
};

export const handleGetServices = async (activeOnly = false): Promise<IServiceCatalog[]> => {
  const res = await api.get("/api/billing/services", {
    params: { activeOnly },
  });
  return res.data.data;
};

export const handleCreateService = async (payload: {
  name: string;
  category: ServiceCategory;
  defaultPrice: number;
  description?: string | null;
  isActive?: boolean;
}): Promise<IServiceCatalog> => {
  const res = await api.post("/api/billing/services", payload);
  return res.data.data;
};

export const handleUpdateService = async (
  id: string,
  payload: Partial<{
    name: string;
    category: ServiceCategory;
    defaultPrice: number;
    description?: string | null;
    isActive: boolean;
  }>,
): Promise<IServiceCatalog> => {
  const res = await api.patch(`/api/billing/services/${id}`, payload);
  return res.data.data;
};

export const handleDeleteService = async (id: string): Promise<void> => {
  await api.delete(`/api/billing/services/${id}`);
};

export const handleGetInvoices = async (filters: InvoiceFilters = {}) => {
  const res = await api.get("/api/billing/invoices", { params: filters });
  return res.data as {
    success: boolean;
    data: IInvoice[];
    meta: { total: number; page: number; limit: number; pages: number };
  };
};

export const handleGetInvoiceById = async (id: string): Promise<IInvoice> => {
  const res = await api.get(`/api/billing/invoices/${id}`);
  return res.data.data;
};

export const handleCreateInvoice = async (
  payload: CreateInvoicePayload,
): Promise<IInvoice> => {
  const res = await api.post("/api/billing/invoices", payload);
  return res.data.data;
};

export const handleUpdateInvoice = async (
  id: string,
  payload: Partial<CreateInvoicePayload>,
): Promise<IInvoice> => {
  const res = await api.patch(`/api/billing/invoices/${id}`, payload);
  return res.data.data;
};

export const handleCancelInvoice = async (id: string): Promise<IInvoice> => {
  const res = await api.patch(`/api/billing/invoices/${id}/cancel`);
  return res.data.data;
};

export const handleRecordPayment = async (
  invoiceId: string,
  payload: RecordPaymentPayload,
): Promise<{ payment: IPayment; invoice: IInvoice }> => {
  const res = await api.post(`/api/billing/invoices/${invoiceId}/payments`, payload);
  return res.data.data;
};

export const handleGetPaymentById = async (id: string): Promise<IPayment> => {
  const res = await api.get(`/api/billing/payments/${id}`);
  return res.data.data;
};

// ── HOOKS ────────────────────────────────────────────────────────────────────

export function useBillingSummary() {
  return useQuery<IBillingSummary>({
    queryKey: ["billing-summary"],
    queryFn: handleGetBillingSummary,
  });
}

export function useServices(activeOnly = false) {
  return useQuery<IServiceCatalog[]>({
    queryKey: ["billing-services", activeOnly],
    queryFn: () => handleGetServices(activeOnly),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleCreateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-services"] });
      toast.success("Service item added");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add service item");
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      handleUpdateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-services"] });
      toast.success("Service item updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update service");
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleDeleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billing-services"] });
      toast.success("Service item removed");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete service");
    },
  });
}

export function useInvoices(filters: InvoiceFilters = {}) {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => handleGetInvoices(filters),
  });
}

export function useInvoice(id: string) {
  return useQuery<IInvoice>({
    queryKey: ["invoice", id],
    queryFn: () => handleGetInvoiceById(id),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleCreateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["billing-summary"] });
      toast.success("Invoice created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create invoice");
    },
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: handleCancelInvoice,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["billing-summary"] });
      toast.success("Invoice cancelled");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to cancel invoice");
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      invoiceId,
      payload,
    }: {
      invoiceId: string;
      payload: RecordPaymentPayload;
    }) => handleRecordPayment(invoiceId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: ["billing-summary"] });
      toast.success("Payment recorded successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to record payment");
    },
  });
}

export function usePaymentReceipt(id: string) {
  return useQuery<IPayment>({
    queryKey: ["payment-receipt", id],
    queryFn: () => handleGetPaymentById(id),
    enabled: !!id,
  });
}
