import { useEffect, useState } from "react";
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
import { useRecordPayment } from "@/services/apiBilling";
import type { IInvoice, PaymentMethod } from "@/types/BillingType";
import { formatPHP, PAYMENT_METHOD_LABELS } from "./billingUtils";

interface RecordPaymentDialogProps {
  invoice: IInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (paymentId: string) => void;
}

export function RecordPaymentDialog({
  invoice,
  open,
  onOpenChange,
  onSuccess,
}: RecordPaymentDialogProps) {
  const { mutate: recordPayment, isPending } = useRecordPayment();

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (invoice && open) {
      setAmount(invoice.balance.toFixed(2));
      setPaymentMethod("CASH");
      setReferenceNumber("");
      setNotes("");
    }
  }, [invoice, open]);

  if (!invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    recordPayment(
      {
        invoiceId: invoice.id,
        payload: {
          amount: numericAmount,
          paymentMethod,
          referenceNumber: referenceNumber.trim() || null,
          notes: notes.trim() || null,
        },
      },
      {
        onSuccess: (res) => {
          onOpenChange(false);
          if (onSuccess) onSuccess(res.payment.id);
        },
      },
    );
  };

  const patientName = invoice.patient
    ? `${invoice.patient.firstName} ${invoice.patient.lastName}`
    : "Patient";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            {invoice.invoiceNumber} • {patientName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/40 p-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              Remaining Balance Due
            </span>
            <span className="text-lg font-bold text-foreground font-mono">
              {formatPHP(invoice.balance)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Amount Tendered (₱)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max={invoice.balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {paymentMethod !== "CASH" && (
            <div className="space-y-1.5">
              <Label className="text-xs">
                {paymentMethod === "HMO_INSURANCE"
                  ? "HMO Provider / Approval Ref #"
                  : "Reference / Transaction #"}
              </Label>
              <Input
                placeholder="Enter reference or approval code"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Notes (Optional)</Label>
            <Textarea
              rows={2}
              placeholder="Any payment remarks..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
