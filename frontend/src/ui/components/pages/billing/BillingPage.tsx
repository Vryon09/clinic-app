import { useState } from "react";
import { useNavigate } from "react-router";
import { useBillingSummary, useInvoices } from "@/services/apiBilling";
import { Card } from "../../shadcn/card";
import { Button } from "../../shadcn/button";
import { Input } from "../../shadcn/input";
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
  Eye,
  Plus,
  Printer,
  Search,
  Settings2,
  Wallet,
  Clock,
  CheckCircle2,
  Banknote,
} from "lucide-react";
import dayjs from "dayjs";
import type { IInvoice } from "@/types/BillingType";
import { formatPHP, INVOICE_STATUS_CONFIG } from "./billingUtils";
import { InvoiceFormDialog } from "./InvoiceFormDialog";
import { ServiceCatalogDialog } from "./ServiceCatalogDialog";
import { RecordPaymentDialog } from "./RecordPaymentDialog";

const STATUS_TABS = [
  { value: "ALL", label: "All Invoices" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "PARTIALLY_PAID", label: "Partial" },
  { value: "PAID", label: "Paid" },
  { value: "DRAFT", label: "Drafts" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function BillingPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<IInvoice | null>(null);

  const { data: summary } = useBillingSummary();
  const { data: invoicesRes, isLoading } = useInvoices({
    status,
    search,
    page,
    limit: 15,
  });

  const invoices = invoicesRes?.data || [];
  const meta = invoicesRes?.meta;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Billing &amp; Invoicing
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Manage patient invoices, payment collections, and clinic fee schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCatalogOpen(true)}
            className="gap-1.5 cursor-pointer"
          >
            <Settings2 className="size-3.5" />
            Service Catalog
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5 cursor-pointer"
          >
            <Plus className="size-3.5" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 rounded-2xl border border-border/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Collected Today
            </p>
            <p className="text-xl font-bold font-mono mt-1">
              {formatPHP(summary?.collectedToday || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {summary?.paymentsTodayCount || 0} payments today
            </p>
          </div>
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Banknote className="size-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border border-border/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Collected
            </p>
            <p className="text-xl font-bold font-mono mt-1">
              {formatPHP(summary?.totalCollected || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {summary?.paidCount || 0} paid invoices
            </p>
          </div>
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CheckCircle2 className="size-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border border-border/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Outstanding Receivables
            </p>
            <p className="text-xl font-bold font-mono mt-1 text-amber-600 dark:text-amber-400">
              {formatPHP(summary?.totalOutstanding || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {(summary?.unpaidCount || 0) + (summary?.partialCount || 0)} awaiting payment
            </p>
          </div>
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Clock className="size-5" />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border border-border/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Billed
            </p>
            <p className="text-xl font-bold font-mono mt-1">
              {formatPHP(summary?.totalBilled || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              All active invoices
            </p>
          </div>
          <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
            <Wallet className="size-5" />
          </div>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="rounded-2xl border border-border/80 overflow-hidden">
        <div className="p-4 border-b border-border/60 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_TABS.map((tab) => (
              <Button
                key={tab.value}
                size="sm"
                variant={status === tab.value ? "default" : "ghost"}
                onClick={() => {
                  setStatus(tab.value);
                  setPage(1);
                }}
                className="h-7.5 px-3 text-xs cursor-pointer"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoice # or patient..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Invoice #</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Patient</TableHead>
              <TableHead className="text-xs text-right">Total</TableHead>
              <TableHead className="text-xs text-right">Paid</TableHead>
              <TableHead className="text-xs text-right">Balance</TableHead>
              <TableHead className="text-xs text-center">Status</TableHead>
              <TableHead className="text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-xs text-muted-foreground py-10"
                >
                  Loading invoices...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-xs text-muted-foreground py-10"
                >
                  No invoices found matching your criteria.
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
                  <TableRow
                    key={inv.id}
                    className="cursor-pointer hover:bg-muted/30"
                    onClick={() => navigate(`/billing/invoices/${inv.id}`)}
                  >
                    <TableCell className="text-xs font-mono font-semibold">
                      {inv.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {dayjs(inv.issueDate).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {inv.patient
                        ? `${inv.patient.lastName}, ${inv.patient.firstName}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono">
                      {formatPHP(inv.totalAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono text-emerald-600">
                      {formatPHP(inv.paidAmount)}
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono font-semibold">
                      {formatPHP(inv.balance)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${st.className}`}>
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                          title="View Details"
                          onClick={() => navigate(`/billing/invoices/${inv.id}`)}
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 cursor-pointer"
                          title="Print Invoice"
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

        {meta && meta.pages > 1 && (
          <div className="px-4 py-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Page {meta.page} of {meta.pages} ({meta.total} invoices)
            </span>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-7 text-xs cursor-pointer"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= meta.pages}
                onClick={() => setPage((p) => p + 1)}
                className="h-7 text-xs cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <InvoiceFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={(id) => navigate(`/billing/invoices/${id}`)}
      />

      <ServiceCatalogDialog open={catalogOpen} onOpenChange={setCatalogOpen} />

      <RecordPaymentDialog
        invoice={paymentInvoice}
        open={!!paymentInvoice}
        onOpenChange={(open) => {
          if (!open) setPaymentInvoice(null);
        }}
        onSuccess={(paymentId) => {
          navigate(`/billing/receipts/${paymentId}/print`);
        }}
      />
    </div>
  );
}
