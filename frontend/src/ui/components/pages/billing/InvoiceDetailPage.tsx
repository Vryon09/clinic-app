import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCancelInvoice, useInvoice } from "@/services/apiBilling";
import BackButton from "../../BackButton";
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { Badge } from "../../shadcn/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import {
  CreditCard,
  Printer,
  Ban,
  Receipt,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import dayjs from "dayjs";
import {
  formatPHP,
  INVOICE_STATUS_CONFIG,
  PAYMENT_METHOD_LABELS,
  SERVICE_CATEGORY_LABELS,
} from "./billingUtils";
import { RecordPaymentDialog } from "./RecordPaymentDialog";

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams() as { invoiceId: string };
  const navigate = useNavigate();
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { mutate: cancelInvoice, isPending: isCancelling } = useCancelInvoice();
  const [paymentOpen, setPaymentOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Loading invoice details...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Invoice not found.
      </div>
    );
  }

  const statusInfo = INVOICE_STATUS_CONFIG[invoice.status];
  const canPay =
    invoice.status !== "PAID" &&
    invoice.status !== "CANCELLED" &&
    invoice.balance > 0;
  const canCancel =
    invoice.status !== "CANCELLED" && invoice.paidAmount === 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BackButton location="/billing" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight font-mono">
                {invoice.invoiceNumber}
              </h1>
              <Badge variant="outline" className={statusInfo.className}>
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Issued {dayjs(invoice.issueDate).format("MMMM D, YYYY")}
              {invoice.dueDate &&
                ` • Due ${dayjs(invoice.dueDate).format("MMMM D, YYYY")}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canCancel && (
            <Button
              variant="outline"
              size="sm"
              disabled={isCancelling}
              onClick={() => cancelInvoice(invoice.id)}
              className="gap-1.5 text-destructive hover:text-destructive cursor-pointer"
            >
              <Ban className="size-3.5" />
              Cancel Invoice
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/billing/invoices/${invoice.id}/print`)}
            className="gap-1.5 cursor-pointer"
          >
            <Printer className="size-3.5" />
            Print Invoice
          </Button>
          {canPay && (
            <Button
              size="sm"
              onClick={() => setPaymentOpen(true)}
              className="gap-1.5 cursor-pointer"
            >
              <CreditCard className="size-3.5" />
              Record Payment
            </Button>
          )}
        </div>
      </div>

      {/* Patient & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 rounded-2xl border border-border/80 space-y-2 md:col-span-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
            <UserIcon className="size-3.5" />
            Patient Information
          </div>
          <div>
            <p className="text-base font-bold">
              {invoice.patient?.lastName}, {invoice.patient?.firstName}{" "}
              {invoice.patient?.middleName}
            </p>
            <p className="text-xs text-muted-foreground">
              {invoice.patient?.phone}
              {invoice.patient?.address && ` • ${invoice.patient.address}`}
            </p>
          </div>
          {invoice.record && (
            <div className="pt-2 border-t border-border/50 text-xs flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3.5" />
              <span>
                Linked Consultation:{" "}
                {dayjs(invoice.record.visitDate).format("MMM D, YYYY")}
                {invoice.record.diagnosis && ` (${invoice.record.diagnosis})`}
              </span>
            </div>
          )}
        </Card>

        <Card className="p-5 rounded-2xl border border-border/80 space-y-2.5 bg-muted/20">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-mono">{formatPHP(invoice.subtotal)}</span>
          </div>
          {invoice.discountAmount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600">
              <span>
                Discount{" "}
                {invoice.discountReason ? `(${invoice.discountReason})` : ""}
              </span>
              <span className="font-mono">
                -{formatPHP(invoice.discountAmount)}
              </span>
            </div>
          )}
          {invoice.taxAmount > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Tax ({invoice.taxRate}%)
              </span>
              <span className="font-mono">{formatPHP(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
            <span>Total</span>
            <span className="font-mono">{formatPHP(invoice.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Paid</span>
            <span className="font-mono">{formatPHP(invoice.paidAmount)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between text-base font-bold text-primary">
            <span>Balance Due</span>
            <span className="font-mono">{formatPHP(invoice.balance)}</span>
          </div>
        </Card>
      </div>

      {/* Items */}
      <Card className="rounded-2xl border border-border/80 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/60 bg-muted/20">
          <h2 className="text-sm font-semibold">Itemized Charges</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Item / Service</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs text-right">Unit Price</TableHead>
              <TableHead className="text-xs text-center">Qty</TableHead>
              <TableHead className="text-xs text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item, idx) => (
              <TableRow key={item.id || idx}>
                <TableCell className="text-xs font-medium">{item.name}</TableCell>
                <TableCell className="text-xs">
                  <Badge variant="outline" className="text-[10px]">
                    {SERVICE_CATEGORY_LABELS[item.category]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-right font-mono">
                  {formatPHP(item.unitPrice)}
                </TableCell>
                <TableCell className="text-xs text-center">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-xs text-right font-mono font-semibold">
                  {formatPHP(item.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Payment History */}
      <Card className="rounded-2xl border border-border/80 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Payment History</h2>
        </div>
        {invoice.payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No payments recorded yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Receipt #</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Method</TableHead>
                <TableHead className="text-xs">Reference #</TableHead>
                <TableHead className="text-xs">Received By</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
                <TableHead className="text-xs text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-xs font-mono font-medium">
                    {p.receiptNumber}
                  </TableCell>
                  <TableCell className="text-xs">
                    {dayjs(p.paymentDate).format("MMM D, YYYY h:mm A")}
                  </TableCell>
                  <TableCell className="text-xs">
                    {PAYMENT_METHOD_LABELS[p.paymentMethod]}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.referenceNumber || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.receivedBy
                      ? `${p.receivedBy.firstName} ${p.receivedBy.lastName}`
                      : "Staff"}
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono font-semibold text-emerald-600">
                    {formatPHP(p.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs gap-1 cursor-pointer"
                      onClick={() => navigate(`/billing/receipts/${p.id}/print`)}
                    >
                      <Receipt className="size-3.5" />
                      Print OR
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <RecordPaymentDialog
        invoice={invoice}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        onSuccess={(paymentId) => {
          navigate(`/billing/receipts/${paymentId}/print`);
        }}
      />
    </div>
  );
}
