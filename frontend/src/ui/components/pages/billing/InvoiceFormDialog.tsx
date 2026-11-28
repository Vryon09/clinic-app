import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shadcn/dialog";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
import { Label } from "../../shadcn/label";
import { Textarea } from "../../shadcn/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shadcn/select";
import { useQuery } from "@tanstack/react-query";
import { handleGetPatients } from "@/services/apiPatients";
import type { IPatient } from "@/types/PatientType";
import { useCreateInvoice, useServices } from "@/services/apiBilling";
import type {
  DiscountType,
  IInvoiceItem,
  ServiceCategory,
} from "@/types/BillingType";
import { Plus, Trash2 } from "lucide-react";
import { formatPHP, SERVICE_CATEGORY_LABELS } from "./billingUtils";
import { useAccess } from "@/hooks/useAccess";

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPatientId?: string;
  defaultRecordId?: string;
  prefillItems?: Array<{
    name: string;
    category: ServiceCategory;
    unitPrice: number;
    quantity: number;
  }>;
  onSuccess?: (invoiceId: string) => void;
}

export function InvoiceFormDialog({
  open,
  onOpenChange,
  defaultPatientId,
  defaultRecordId,
  prefillItems,
  onSuccess,
}: InvoiceFormDialogProps) {
  const { isHidden } = useAccess();

  const { data: patients = [] } = useQuery<IPatient[]>({
    queryKey: ["patients-all"],
    queryFn: handleGetPatients,
    enabled: open && !defaultPatientId && !isHidden("patients"),
  });

  const { data: services = [] } = useServices(true, {
    enabled: open && !isHidden("billing"),
  });
  const { mutate: createInvoice, isPending } = useCreateInvoice();

  const [patientId, setPatientId] = useState(defaultPatientId || "");
  const [patientSearch, setPatientSearch] = useState("");
  const [items, setItems] = useState<IInvoiceItem[]>([]);
  const [discountType, setDiscountType] = useState<DiscountType>("NONE");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState("");
  const [taxRate, setTaxRate] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setPatientId(defaultPatientId || "");
      setPatientSearch("");
      setDiscountType("NONE");
      setDiscountValue(0);
      setDiscountReason("");
      setTaxRate(0);
      setDueDate("");
      setNotes("");

      if (prefillItems && prefillItems.length > 0) {
        setItems(
          prefillItems.map((i) => ({
            ...i,
            total: i.unitPrice * i.quantity,
          })),
        );
      } else {
        setItems([
          {
            name: "General Consultation",
            category: "CONSULTATION",
            unitPrice: 500,
            quantity: 1,
            total: 500,
          },
        ]);
      }
    }
  }, [open, defaultPatientId, prefillItems]);

  const filteredPatients = useMemo(() => {
    const active = patients.filter((p) => !(p as any).isArchived);
    if (!patientSearch.trim()) return active.slice(0, 50);
    const q = patientSearch.toLowerCase();
    return active
      .filter(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.phone.includes(q),
      )
      .slice(0, 50);
  }, [patients, patientSearch]);

  const addBlankItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "",
        category: "OTHER",
        unitPrice: 0,
        quantity: 1,
        total: 0,
      },
    ]);
  };

  const addCatalogItem = (serviceId: string) => {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;
    setItems((prev) => [
      ...prev,
      {
        serviceId: svc.id,
        name: svc.name,
        category: svc.category,
        unitPrice: svc.defaultPrice,
        quantity: 1,
        total: svc.defaultPrice,
      },
    ]);
  };

  const updateItem = (index: number, patch: Partial<IInvoiceItem>) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        const next = { ...item, ...patch };
        next.total = next.unitPrice * next.quantity;
        return next;
      }),
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    let discountAmount = 0;
    if (discountType === "PERCENTAGE") {
      discountAmount = subtotal * (Math.min(Math.max(discountValue, 0), 100) / 100);
    } else if (discountType === "FIXED") {
      discountAmount = Math.min(Math.max(discountValue, 0), subtotal);
    }
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    const taxAmount = afterDiscount * (Math.max(taxRate, 0) / 100);
    const totalAmount = afterDiscount + taxAmount;
    return { subtotal, discountAmount, taxAmount, totalAmount };
  }, [items, discountType, discountValue, taxRate]);

  const handleSubmit = (status: "UNPAID" | "DRAFT") => {
    if (!patientId || items.length === 0) return;
    const validItems = items.filter((i) => i.name.trim() !== "");
    if (validItems.length === 0) return;

    createInvoice(
      {
        patientId,
        recordId: defaultRecordId || null,
        dueDate: dueDate || null,
        status,
        discountType,
        discountValue: discountType === "NONE" ? 0 : discountValue,
        discountReason: discountReason.trim() || null,
        taxRate,
        notes: notes.trim() || null,
        items: validItems.map((i) => ({
          serviceId: i.serviceId || null,
          name: i.name.trim(),
          category: i.category,
          unitPrice: Number(i.unitPrice) || 0,
          quantity: Math.max(1, Number(i.quantity) || 1),
        })),
      },
      {
        onSuccess: (created) => {
          onOpenChange(false);
          if (onSuccess) onSuccess(created.id);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Add clinic services, procedures, medications, and applicable discounts.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Patient & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {!defaultPatientId && (
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-xs">Patient</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Filter patient..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="h-9 text-xs sm:w-44 shrink-0"
                  />
                  <Select value={patientId} onValueChange={setPatientId}>
                    <SelectTrigger className="h-9 text-xs flex-1 min-w-0">
                      <SelectValue placeholder="Select patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPatients.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          {p.lastName}, {p.firstName} ({p.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Due Date (Optional)</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-xs font-semibold">Billable Line Items</Label>
              <div className="flex flex-wrap items-center gap-2">
                {services.length > 0 && (
                  <Select onValueChange={addCatalogItem} value="">
                    <SelectTrigger className="h-8 text-xs w-56">
                      <SelectValue placeholder="+ Quick add from catalog..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((svc) => (
                        <SelectItem key={svc.id} value={svc.id} className="text-xs">
                          {svc.name} — {formatPHP(svc.defaultPrice)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addBlankItem}
                  className="h-8 text-xs gap-1 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  Custom Item
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-12 gap-2 bg-muted/40 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
                  <div className="col-span-4">Item Description</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2 text-right">Unit Price (₱)</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-2 text-right">Line Total</div>
                  <div className="col-span-1"></div>
                </div>
                <div className="divide-y divide-border">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 px-3 py-2 items-center"
                    >
                    <div className="col-span-4">
                      <Input
                        placeholder="Item or service name"
                        value={item.name}
                        onChange={(e) => updateItem(idx, { name: e.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={item.category}
                        onValueChange={(v) =>
                          updateItem(idx, { category: v as ServiceCategory })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SERVICE_CATEGORY_LABELS).map(
                            ([k, lbl]) => (
                              <SelectItem key={k} value={k} className="text-xs">
                                {lbl}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(idx, {
                            unitPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-8 text-xs text-right font-mono"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(idx, {
                            quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                          })
                        }
                        className="h-8 text-xs text-center"
                      />
                    </div>
                    <div className="col-span-2 text-right text-xs font-semibold font-mono">
                      {formatPHP(item.unitPrice * item.quantity)}
                    </div>
                    <div className="col-span-1 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={items.length === 1}
                        onClick={() => removeItem(idx)}
                        className="size-7 text-destructive hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>

          {/* Discounts & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3 rounded-xl border border-border p-3.5">
              <Label className="text-xs font-semibold block">
                Discounts &amp; Tax
              </Label>

              <div className="flex flex-wrap gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant={discountType === "NONE" ? "default" : "outline"}
                  className="h-7 text-xs cursor-pointer"
                  onClick={() => {
                    setDiscountType("NONE");
                    setDiscountValue(0);
                    setDiscountReason("");
                  }}
                >
                  None
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={
                    discountType !== "NONE" &&
                    discountReason === "Senior Citizen"
                      ? "default"
                      : "outline"
                  }
                  className="h-7 text-xs cursor-pointer"
                  onClick={() => {
                    setDiscountType("PERCENTAGE");
                    setDiscountValue(0);
                    setDiscountReason("Senior Citizen");
                  }}
                >
                  Senior Citizen
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={
                    discountType !== "NONE" && discountReason === "PWD"
                      ? "default"
                      : "outline"
                  }
                  className="h-7 text-xs cursor-pointer"
                  onClick={() => {
                    setDiscountType("PERCENTAGE");
                    setDiscountValue(0);
                    setDiscountReason("PWD");
                  }}
                >
                  PWD
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[11px]">Type</Label>
                  <Select
                    value={discountType}
                    onValueChange={(v) => setDiscountType(v as DiscountType)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE" className="text-xs">
                        None
                      </SelectItem>
                      <SelectItem value="PERCENTAGE" className="text-xs">
                        Percent (%)
                      </SelectItem>
                      <SelectItem value="FIXED" className="text-xs">
                        Fixed (₱)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-[11px]">Value</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={discountType === "NONE"}
                    value={discountValue}
                    onChange={(e) =>
                      setDiscountValue(parseFloat(e.target.value) || 0)
                    }
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <Label className="text-[11px]">Tax (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              {discountType !== "NONE" && (
                <Input
                  placeholder="Discount reason / ID # (optional)"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="h-8 text-xs"
                />
              )}

              <Textarea
                rows={2}
                placeholder="Invoice notes or payment instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-medium">
                    {formatPHP(totals.subtotal)}
                  </span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>
                      Discount{" "}
                      {discountReason ? `(${discountReason})` : ""}
                    </span>
                    <span className="font-mono">
                      -{formatPHP(totals.discountAmount)}
                    </span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tax ({taxRate}%)
                    </span>
                    <span className="font-mono">{formatPHP(totals.taxAmount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-3 mt-4 flex items-center justify-between">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-xl font-bold font-mono text-primary">
                  {formatPHP(totals.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending || !patientId || items.length === 0}
            onClick={() => handleSubmit("DRAFT")}
            className="cursor-pointer"
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            disabled={isPending || !patientId || items.length === 0}
            onClick={() => handleSubmit("UNPAID")}
            className="cursor-pointer"
          >
            {isPending ? "Saving..." : "Issue Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
