import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useInvoice } from "@/services/apiBilling";
import { handleGetClinicInfo } from "@/services/apiClinicInfo";
import type { IClinicInfo } from "@/types/ClinicInfo";
import { Button } from "../../shadcn/button";
import BackButton from "../../BackButton";
import { Printer } from "lucide-react";
import dayjs from "dayjs";
import { formatPHP, PAYMENT_METHOD_LABELS } from "./billingUtils";

export default function InvoicePrintView() {
  const { invoiceId } = useParams() as { invoiceId: string };
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const { data: clinicInfo } = useQuery<IClinicInfo>({
    queryFn: handleGetClinicInfo,
    queryKey: ["clinicInfo"],
  });

  if (isLoading) {
    return <div className="p-8 text-center text-sm">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="p-8 text-center text-sm">Invoice not found.</div>;
  }

  const logoUrl = clinicInfo?.logoPath
    ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${clinicInfo.logoPath}`
    : null;

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between print:hidden">
        <BackButton location={`/billing/invoices/${invoiceId}`} />
        <Button onClick={() => window.print()} className="gap-2 cursor-pointer">
          <Printer className="size-4" />
          Print Invoice
        </Button>
      </div>

      <div className="mx-auto w-[210mm] bg-white p-10 text-black shadow-md print:w-full print:p-4 print:shadow-none">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-4">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Clinic Logo"
                className="h-14 w-auto object-contain"
              />
            )}
            <div>
              <h1 className="text-xl font-bold">
                {clinicInfo?.name || "ClinicSync"}
              </h1>
              {clinicInfo?.address && (
                <p className="text-xs text-gray-600">{clinicInfo.address}</p>
              )}
              {clinicInfo?.phone && (
                <p className="text-xs text-gray-600">Tel: {clinicInfo.phone}</p>
              )}
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-lg font-bold tracking-wider uppercase">
              Medical Invoice
            </h2>
            <p className="text-sm font-mono font-semibold">
              {invoice.invoiceNumber}
            </p>
            <p className="text-xs text-gray-600">
              Issued: {dayjs(invoice.issueDate).format("MMM D, YYYY")}
            </p>
            {invoice.dueDate && (
              <p className="text-xs text-gray-600">
                Due: {dayjs(invoice.dueDate).format("MMM D, YYYY")}
              </p>
            )}
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-6 grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-bold uppercase text-gray-500 mb-1">Bill To:</p>
            <p className="text-sm font-semibold">
              {invoice.patient?.firstName} {invoice.patient?.middleName}{" "}
              {invoice.patient?.lastName}
            </p>
            {invoice.patient?.phone && <p>Phone: {invoice.patient.phone}</p>}
            {invoice.patient?.address && <p>{invoice.patient.address}</p>}
          </div>
          <div className="text-right">
            <p className="font-bold uppercase text-gray-500 mb-1">Status:</p>
            <p className="text-sm font-bold">{invoice.status.replace("_", " ")}</p>
            {invoice.record?.case?.doctor && (
              <p className="mt-1">
                Attending: Dr. {invoice.record.case.doctor.firstName}{" "}
                {invoice.record.case.doctor.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse text-xs mb-6">
          <thead>
            <tr className="border-y border-black bg-gray-100">
              <th className="py-2 px-2 text-left">Description</th>
              <th className="py-2 px-2 text-left">Category</th>
              <th className="py-2 px-2 text-right">Unit Price</th>
              <th className="py-2 px-2 text-center">Qty</th>
              <th className="py-2 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="py-2 px-2 font-medium">{item.name}</td>
                <td className="py-2 px-2 text-gray-600">{item.category}</td>
                <td className="py-2 px-2 text-right font-mono">
                  {formatPHP(item.unitPrice)}
                </td>
                <td className="py-2 px-2 text-center">{item.quantity}</td>
                <td className="py-2 px-2 text-right font-mono font-medium">
                  {formatPHP(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono">{formatPHP(invoice.subtotal)}</span>
            </div>
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between">
                <span>
                  Discount{" "}
                  {invoice.discountReason ? `(${invoice.discountReason})` : ""}:
                </span>
                <span className="font-mono">
                  -{formatPHP(invoice.discountAmount)}
                </span>
              </div>
            )}
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between">
                <span>Tax ({invoice.taxRate}%):</span>
                <span className="font-mono">{formatPHP(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-black pt-1.5 text-sm font-bold">
              <span>Total Amount:</span>
              <span className="font-mono">{formatPHP(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Amount Paid:</span>
              <span className="font-mono">{formatPHP(invoice.paidAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-1 text-sm font-bold">
              <span>Balance Due:</span>
              <span className="font-mono">{formatPHP(invoice.balance)}</span>
            </div>
          </div>
        </div>

        {/* Payments */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="mb-8 border-t border-gray-300 pt-4">
            <p className="text-xs font-bold uppercase text-gray-600 mb-2">
              Payment History
            </p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300 text-left">
                  <th className="py-1">Receipt #</th>
                  <th className="py-1">Date</th>
                  <th className="py-1">Method</th>
                  <th className="py-1">Reference</th>
                  <th className="py-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="py-1 font-mono">{p.receiptNumber}</td>
                    <td className="py-1">
                      {dayjs(p.paymentDate).format("MMM D, YYYY h:mm A")}
                    </td>
                    <td className="py-1">
                      {PAYMENT_METHOD_LABELS[p.paymentMethod]}
                    </td>
                    <td className="py-1">{p.referenceNumber || "—"}</td>
                    <td className="py-1 text-right font-mono">
                      {formatPHP(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {invoice.notes && (
          <div className="mb-8 text-xs text-gray-600">
            <span className="font-semibold">Notes:</span> {invoice.notes}
          </div>
        )}

        {/* Footer Signature */}
        <div className="mt-12 flex justify-between text-xs pt-6 border-t border-gray-300">
          <div>
            <p className="font-semibold">Prepared by:</p>
            <p className="mt-6 border-t border-black pt-1 w-48">
              {invoice.createdBy
                ? `${invoice.createdBy.firstName} ${invoice.createdBy.lastName}`
                : "Clinic Staff"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Thank you for trusting our clinic.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
