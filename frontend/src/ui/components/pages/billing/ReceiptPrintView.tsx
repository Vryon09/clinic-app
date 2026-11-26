import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { usePaymentReceipt } from "@/services/apiBilling";
import { handleGetClinicInfo } from "@/services/apiClinicInfo";
import type { IClinicInfo } from "@/types/ClinicInfo";
import { Button } from "../../shadcn/button";
import BackButton from "../../BackButton";
import { Printer } from "lucide-react";
import dayjs from "dayjs";
import { formatPHP, PAYMENT_METHOD_LABELS } from "./billingUtils";

export default function ReceiptPrintView() {
  const { paymentId } = useParams() as { paymentId: string };
  const { data: payment, isLoading } = usePaymentReceipt(paymentId);
  const { data: clinicInfo } = useQuery<IClinicInfo>({
    queryFn: handleGetClinicInfo,
    queryKey: ["clinicInfo"],
  });

  if (isLoading) {
    return <div className="p-8 text-center text-sm">Loading receipt...</div>;
  }

  if (!payment) {
    return <div className="p-8 text-center text-sm">Receipt not found.</div>;
  }

  const logoUrl = clinicInfo?.logoPath
    ? `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${clinicInfo.logoPath}`
    : null;

  return (
    <div className="space-y-4 pb-10">
      <div className="flex items-center justify-between print:hidden">
        <BackButton location="/billing" />
        <Button onClick={() => window.print()} className="gap-2 cursor-pointer">
          <Printer className="size-4" />
          Print Official Receipt
        </Button>
      </div>

      <div className="mx-auto w-[148mm] bg-white p-8 text-black shadow-md print:w-full print:p-4 print:shadow-none">
        {/* Header */}
        <div className="mb-5 text-center border-b-2 border-black pb-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Clinic Logo"
              className="mx-auto mb-2 h-12 w-auto object-contain"
            />
          )}
          <h1 className="text-lg font-bold">
            {clinicInfo?.name || "ClinicSync"}
          </h1>
          {clinicInfo?.address && (
            <p className="text-xs text-gray-600">{clinicInfo.address}</p>
          )}
          {clinicInfo?.phone && (
            <p className="text-xs text-gray-600">Tel: {clinicInfo.phone}</p>
          )}
          <h2 className="mt-3 text-sm font-bold uppercase tracking-wider">
            Official Payment Receipt
          </h2>
          <p className="text-xs font-mono font-semibold">
            {payment.receiptNumber}
          </p>
        </div>

        {/* Details */}
        <div className="mb-4 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{dayjs(payment.paymentDate).format("MMM D, YYYY h:mm A")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Received From:</span>
            <span className="font-semibold">
              {payment.patient?.firstName} {payment.patient?.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Invoice Ref:</span>
            <span className="font-mono">{payment.invoice?.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span>{PAYMENT_METHOD_LABELS[payment.paymentMethod]}</span>
          </div>
          {payment.referenceNumber && (
            <div className="flex justify-between">
              <span className="text-gray-600">Ref / Approval #:</span>
              <span className="font-mono">{payment.referenceNumber}</span>
            </div>
          )}
        </div>

        {/* Amount Box */}
        <div className="my-5 rounded border border-black p-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase">Amount Paid</span>
          <span className="text-lg font-bold font-mono">
            {formatPHP(payment.amount)}
          </span>
        </div>

        {payment.invoice && (
          <div className="mb-6 space-y-1 text-xs border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Total:</span>
              <span className="font-mono">
                {formatPHP(payment.invoice.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Remaining Balance:</span>
              <span className="font-mono">
                {formatPHP(payment.invoice.balance)}
              </span>
            </div>
          </div>
        )}

        {payment.notes && (
          <p className="mb-6 text-xs text-gray-600">Notes: {payment.notes}</p>
        )}

        <div className="mt-10 pt-4 border-t border-gray-300 flex justify-between items-end text-xs">
          <div>
            <p className="border-t border-black pt-1 w-40">
              {payment.receivedBy
                ? `${payment.receivedBy.firstName} ${payment.receivedBy.lastName}`
                : "Cashier"}
            </p>
            <p className="text-[10px] text-gray-500">Authorized Representative</p>
          </div>
          <p className="text-[10px] text-gray-500">Thank you!</p>
        </div>
      </div>
    </div>
  );
}
