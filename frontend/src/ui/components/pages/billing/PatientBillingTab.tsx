import { useState } from "react";
import { useNavigate } from "react-router";
import { useInvoices } from "@/services/apiBilling";
import { Button } from "../../shadcn/button";
import { Badge } from "../../shadcn/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { CreditCard, Eye, Plus, Printer } from "lucide-react";
import dayjs from "dayjs";
import type { IInvoice } from "@/types/BillingType";
import { formatPHP, INVOICE_STATUS_CONFIG } from "./billingUtils";
import { InvoiceFormDialog } from "./InvoiceFormDialog";
import { RecordPaymentDialog } from "./RecordPaymentDialog";

export function PatientBillingTab({ patientId }: { patientId: string }) {
  const navigate = useNavigate();
  const { data: invoicesRes, isLoading } = useInvoices({
    patientId,
    limit: 50,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<IInvoice | null>(null);

  const invoices = invoicesRes?.data || [];
  const totalOutstanding = invoices
    .filter((i) => i.status !== "CANCELLED")
    .reduce((sum, i) => sum + i.balance, 0);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold">Patient Billing History</h3>
          <p className="text-xs text-muted-foreground">
            Outstanding Balance:{" "}
            <span className="font-mono font-bold text-foreground">
              {formatPHP(totalOutstanding)}
            </span>
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setCreateOpen(true)}
          className="h-8 gap-1.5 text-xs cursor-pointer"
        >
          <Plus className="size-3.5" />
          New Invoice
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Invoice #</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs text-right">Total</TableHead>
              <TableHead className="text-xs text-right">Balance</TableHead>
              <TableHead className="text-xs text-center">Status</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-xs text-muted-foreground py-8"
                >
                  Loading billing records...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-xs text-muted-foreground py-8"
                >
                  No invoices recorded for this patient.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => {
                const st = INVOICE_STATUS_CONFIG[inv.status];
                const canPay =
                  inv.status !== "PAID" &&
                  inv.status !== "CANCELLED" &&
                  inv.balance > 0;
                return (
                  <TableRow key={inv.id}>
                    <TableCell className="text-xs font-mono font-semibold">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {dayjs(inv.issueDate).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono">
                      {formatPHP(inv.totalAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono font-semibold">
                      {formatPHP(inv.balance)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${st.className}`}>
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {canPay && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs gap-1 cursor-pointer"
                            onClick={() => setPaymentInvoice(inv)}
                          >
                            <CreditCard className="size-3" />
                            Pay
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 cursor-pointer"
                          onClick={() => navigate(`/billing/invoices/${inv.id}`)}
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 cursor-pointer"
                          onClick={() =>
                            navigate(`/billing/invoices/${inv.id}/print`)
                          }
                        >
                          <Printer className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <InvoiceFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultPatientId={patientId}
        onSuccess={(id) => navigate(`/billing/invoices/${id}`)}
      />

      <RecordPaymentDialog
        invoice={paymentInvoice}
        open={!!paymentInvoice}
        onOpenChange={(open) => {
          if (!open) setPaymentInvoice(null);
        }}
        onSuccess={(paymentId) =>
          navigate(`/billing/receipts/${paymentId}/print`)
        }
      />
    </div>
  );
}
