import { Response } from "express";
import { UserRequest } from "../types/express";
import { prisma } from "../config/prisma";

interface LineItemInput {
  serviceId?: string | null;
  name: string;
  category: "CONSULTATION" | "PROCEDURE" | "MEDICATION" | "LABORATORY" | "SUPPLIES" | "OTHER";
  unitPrice: number;
  quantity: number;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateTotals(
  items: LineItemInput[],
  discountType: "NONE" | "PERCENTAGE" | "FIXED",
  discountValue: number,
  taxRate: number,
) {
  const subtotal = roundCurrency(
    items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );

  let discountAmount = 0;
  if (discountType === "PERCENTAGE") {
    const pct = Math.min(Math.max(discountValue, 0), 100);
    discountAmount = roundCurrency(subtotal * (pct / 100));
  } else if (discountType === "FIXED") {
    discountAmount = roundCurrency(Math.min(Math.max(discountValue, 0), subtotal));
  }

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = roundCurrency(afterDiscount * (Math.max(taxRate, 0) / 100));
  const totalAmount = roundCurrency(afterDiscount + taxAmount);

  return { subtotal, discountAmount, taxAmount, totalAmount };
}

async function generateSequenceNumber(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  model: "invoice" | "payment",
  prefixCode: string,
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `${prefixCode}-${year}-`;

  if (model === "invoice") {
    const latest = await tx.invoice.findFirst({
      where: { invoiceNumber: { startsWith: prefix } },
      orderBy: { invoiceNumber: "desc" },
      select: { invoiceNumber: true },
    });
    const lastSeq = latest ? parseInt(latest.invoiceNumber.replace(prefix, ""), 10) || 0 : 0;
    return `${prefix}${String(lastSeq + 1).padStart(4, "0")}`;
  }

  const latest = await tx.payment.findFirst({
    where: { receiptNumber: { startsWith: prefix } },
    orderBy: { receiptNumber: "desc" },
    select: { receiptNumber: true },
  });
  const lastSeq = latest ? parseInt(latest.receiptNumber.replace(prefix, ""), 10) || 0 : 0;
  return `${prefix}${String(lastSeq + 1).padStart(4, "0")}`;
}

// ── SERVICE CATALOG ──────────────────────────────────────────────────────────

export async function getServices(req: UserRequest, res: Response) {
  try {
    const activeOnly = req.query.activeOnly === "true";
    const services = await prisma.serviceCatalog.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error("getServices error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function createService(req: UserRequest, res: Response) {
  try {
    const service = await prisma.serviceCatalog.create({ data: req.body });

    await prisma.systemLogs.create({
      data: {
        action: "CREATE",
        module: "Billing",
        target: `Service: ${service.name}`,
        details: `Created service catalog item "${service.name}" (₱${service.defaultPrice.toFixed(2)})`,
        userId: req.userId!,
      },
    });

    return res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error("createService error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateService(req: UserRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const service = await prisma.serviceCatalog.update({
      where: { id },
      data: req.body,
    });

    await prisma.systemLogs.create({
      data: {
        action: "UPDATE",
        module: "Billing",
        target: `Service: ${service.name}`,
        details: `Updated service catalog item "${service.name}"`,
        userId: req.userId!,
      },
    });

    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error("updateService error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteService(req: UserRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const service = await prisma.serviceCatalog.delete({ where: { id } });

    await prisma.systemLogs.create({
      data: {
        action: "DELETE",
        module: "Billing",
        target: `Service: ${service.name}`,
        details: `Deleted service catalog item "${service.name}"`,
        userId: req.userId!,
      },
    });

    return res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("deleteService error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// ── BILLING SUMMARY ──────────────────────────────────────────────────────────

export async function getBillingSummary(req: UserRequest, res: Response) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [activeInvoices, paymentsToday] = await Promise.all([
      prisma.invoice.findMany({
        where: { isArchived: false, status: { not: "CANCELLED" } },
        select: {
          status: true,
          totalAmount: true,
          paidAmount: true,
          balance: true,
        },
      }),
      prisma.payment.aggregate({
        where: { paymentDate: { gte: startOfToday } },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    let totalBilled = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;
    let unpaidCount = 0;
    let partialCount = 0;
    let paidCount = 0;

    for (const inv of activeInvoices) {
      totalBilled += inv.totalAmount;
      totalCollected += inv.paidAmount;
      totalOutstanding += inv.balance;
      if (inv.status === "UNPAID") unpaidCount++;
      else if (inv.status === "PARTIALLY_PAID") partialCount++;
      else if (inv.status === "PAID") paidCount++;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalBilled: roundCurrency(totalBilled),
        totalCollected: roundCurrency(totalCollected),
        totalOutstanding: roundCurrency(totalOutstanding),
        collectedToday: roundCurrency(paymentsToday._sum.amount || 0),
        paymentsTodayCount: paymentsToday._count || 0,
        unpaidCount,
        partialCount,
        paidCount,
      },
    });
  } catch (error) {
    console.error("getBillingSummary error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// ── INVOICES ─────────────────────────────────────────────────────────────────

export async function getInvoices(req: UserRequest, res: Response) {
  try {
    const limit = Math.max(1, parseInt(req.query.limit as string) || 15);
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const skip = (page - 1) * limit;
    const status = req.query.status as string | undefined;
    const patientId = req.query.patientId as string | undefined;
    const recordId = req.query.recordId as string | undefined;
    const search = (req.query.search as string | undefined)?.trim();

    const where: any = { isArchived: false };
    if (status && status !== "ALL") where.status = status;
    if (patientId) where.patientId = patientId;
    if (recordId) where.recordId = recordId;
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { patient: { firstName: { contains: search } } },
        { patient: { lastName: { contains: search } } },
      ];
    }

    const [invoices, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        include: {
          patient: {
            select: { id: true, firstName: true, middleName: true, lastName: true, phone: true },
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true, role: true },
          },
          items: true,
          payments: { orderBy: { paymentDate: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: invoices,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("getInvoices error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getInvoiceById(req: UserRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        patient: true,
        record: {
          include: {
            case: {
              include: {
                doctor: {
                  select: { id: true, firstName: true, middleName: true, lastName: true, licenseNum: true },
                },
              },
            },
          },
        },
        createdBy: {
          select: { id: true, firstName: true, middleName: true, lastName: true, role: true },
        },
        items: true,
        payments: {
          include: {
            receivedBy: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
          orderBy: { paymentDate: "desc" },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    console.error("getInvoiceById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function createInvoice(req: UserRequest, res: Response) {
  try {
    const {
      patientId,
      recordId,
      issueDate,
      dueDate,
      status,
      discountType,
      discountValue,
      discountReason,
      taxRate,
      notes,
      items,
    } = req.body;

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const { subtotal, discountAmount, taxAmount, totalAmount } = calculateTotals(
      items,
      discountType,
      discountValue,
      taxRate,
    );

    const invoice = await prisma.$transaction(async (tx) => {
      const invoiceNumber = await generateSequenceNumber(tx, "invoice", "INV");

      const created = await tx.invoice.create({
        data: {
          invoiceNumber,
          patientId,
          recordId: recordId || null,
          createdById: req.userId!,
          issueDate: issueDate ? new Date(issueDate) : new Date(),
          dueDate: dueDate ? new Date(dueDate) : null,
          status: status || "UNPAID",
          subtotal,
          discountType,
          discountValue,
          discountAmount,
          discountReason: discountReason || null,
          taxRate,
          taxAmount,
          totalAmount,
          paidAmount: 0,
          balance: totalAmount,
          notes: notes || null,
          items: {
            create: items.map((item: LineItemInput) => ({
              serviceId: item.serviceId || null,
              name: item.name,
              category: item.category,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              total: roundCurrency(item.unitPrice * item.quantity),
            })),
          },
        },
        include: {
          patient: true,
          items: true,
        },
      });

      await tx.systemLogs.create({
        data: {
          action: "CREATE",
          module: "Billing",
          target: `Invoice ${invoiceNumber}`,
          details: `Created invoice ${invoiceNumber} for ${patient.firstName} ${patient.lastName} (Total: ₱${totalAmount.toFixed(2)})`,
          userId: req.userId!,
        },
      });

      return created;
    });

    return res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error("createInvoice error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateInvoice(req: UserRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const existing = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true, patient: true },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    if (existing.status === "PAID" || existing.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: `Cannot edit an invoice with status ${existing.status}`,
      });
    }

    const items: LineItemInput[] =
      req.body.items ||
      existing.items.map((i) => ({
        serviceId: i.serviceId,
        name: i.name,
        category: i.category,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      }));
    const discountType = req.body.discountType ?? existing.discountType;
    const discountValue = req.body.discountValue ?? existing.discountValue;
    const taxRate = req.body.taxRate ?? existing.taxRate;

    const { subtotal, discountAmount, taxAmount, totalAmount } = calculateTotals(
      items,
      discountType,
      discountValue,
      taxRate,
    );

    const balance = roundCurrency(Math.max(0, totalAmount - existing.paidAmount));
    let nextStatus = req.body.status ?? existing.status;
    if (existing.paidAmount > 0) {
      nextStatus = balance <= 0 ? "PAID" : "PARTIALLY_PAID";
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (req.body.items) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      }

      const inv = await tx.invoice.update({
        where: { id },
        data: {
          dueDate: req.body.dueDate !== undefined ? (req.body.dueDate ? new Date(req.body.dueDate) : null) : existing.dueDate,
          status: nextStatus,
          subtotal,
          discountType,
          discountValue,
          discountAmount,
          discountReason: req.body.discountReason !== undefined ? req.body.discountReason : existing.discountReason,
          taxRate,
          taxAmount,
          totalAmount,
          balance,
          notes: req.body.notes !== undefined ? req.body.notes : existing.notes,
          ...(req.body.items
            ? {
                items: {
                  create: items.map((item) => ({
                    serviceId: item.serviceId || null,
                    name: item.name,
                    category: item.category,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    total: roundCurrency(item.unitPrice * item.quantity),
                  })),
                },
              }
            : {}),
        },
        include: { items: true, payments: true, patient: true },
      });

      await tx.systemLogs.create({
        data: {
          action: "UPDATE",
          module: "Billing",
          target: `Invoice ${existing.invoiceNumber}`,
          details: `Updated invoice ${existing.invoiceNumber} (New Total: ₱${totalAmount.toFixed(2)})`,
          userId: req.userId!,
        },
      });

      return inv;
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("updateInvoice error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function cancelInvoice(req: UserRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const existing = await prisma.invoice.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    if (existing.paidAmount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an invoice that already has recorded payments",
      });
    }

    const cancelled = await prisma.invoice.update({
      where: { id },
      data: { status: "CANCELLED", balance: 0 },
    });

    await prisma.systemLogs.create({
      data: {
        action: "CANCEL",
        module: "Billing",
        target: `Invoice ${existing.invoiceNumber}`,
        details: `Cancelled invoice ${existing.invoiceNumber}`,
        userId: req.userId!,
      },
    });

    return res.status(200).json({ success: true, data: cancelled });
  } catch (error) {
    console.error("cancelInvoice error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// ── PAYMENTS ─────────────────────────────────────────────────────────────────

export async function recordPayment(req: UserRequest, res: Response) {
  try {
    const invoiceId = req.params.id as string;
    const { amount, paymentMethod, referenceNumber, paymentDate, notes } = req.body;

    const existing = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { patient: true },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    if (existing.status === "CANCELLED") {
      return res.status(400).json({ success: false, message: "Cannot record payment on a cancelled invoice" });
    }
    if (existing.status === "PAID" || existing.balance <= 0) {
      return res.status(400).json({ success: false, message: "Invoice is already fully paid" });
    }
    if (amount > existing.balance + 0.01) {
      return res.status(400).json({
        success: false,
        message: `Payment amount (₱${amount.toFixed(2)}) exceeds remaining balance (₱${existing.balance.toFixed(2)})`,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const receiptNumber = await generateSequenceNumber(tx, "payment", "REC");

      const payment = await tx.payment.create({
        data: {
          receiptNumber,
          invoiceId,
          patientId: existing.patientId,
          receivedById: req.userId!,
          amount: roundCurrency(amount),
          paymentMethod,
          referenceNumber: referenceNumber || null,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          notes: notes || null,
        },
        include: {
          receivedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      });

      const newPaidAmount = roundCurrency(existing.paidAmount + amount);
      const newBalance = roundCurrency(Math.max(0, existing.totalAmount - newPaidAmount));
      const newStatus = newBalance <= 0 ? "PAID" : "PARTIALLY_PAID";

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          paidAmount: newPaidAmount,
          balance: newBalance,
          status: newStatus,
        },
        include: {
          items: true,
          payments: { orderBy: { paymentDate: "desc" } },
          patient: true,
        },
      });

      await tx.systemLogs.create({
        data: {
          action: "PAYMENT",
          module: "Billing",
          target: `Receipt ${receiptNumber}`,
          details: `Recorded ₱${amount.toFixed(2)} (${paymentMethod}) for ${existing.invoiceNumber} - ${existing.patient.firstName} ${existing.patient.lastName}`,
          userId: req.userId!,
        },
      });

      return { payment, invoice: updatedInvoice };
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("recordPayment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getPaymentById(req: UserRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        patient: true,
        receivedBy: { select: { id: true, firstName: true, middleName: true, lastName: true } },
        invoice: { include: { items: true } },
      },
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment receipt not found" });
    }

    return res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("getPaymentById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
