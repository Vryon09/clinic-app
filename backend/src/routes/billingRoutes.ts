import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { authorize } from "../middleware/authorize";
import { validateSchema } from "../middleware/validateSchema";
import { PERMISSIONS } from "../rbac/permissions";
import {
  createInvoiceSchema,
  createServiceSchema,
  recordPaymentSchema,
  updateInvoiceSchema,
  updateServiceSchema,
} from "../schemas/billingSchema";
import {
  cancelInvoice,
  createInvoice,
  createService,
  deleteService,
  getBillingSummary,
  getInvoiceById,
  getInvoices,
  getPaymentById,
  getServices,
  recordPayment,
  updateInvoice,
  updateService,
} from "../controller/billingController";

const router = Router();

router.use(verifyToken);

// Summary
router.get("/summary", authorize(PERMISSIONS.BILLING_VIEW), getBillingSummary);

// Service Catalog
router.get("/services", authorize(PERMISSIONS.BILLING_VIEW), getServices);
router.post(
  "/services",
  authorize(PERMISSIONS.BILLING_UPDATE),
  validateSchema(createServiceSchema),
  createService,
);
router.patch(
  "/services/:id",
  authorize(PERMISSIONS.BILLING_UPDATE),
  validateSchema(updateServiceSchema),
  updateService,
);
router.delete("/services/:id", authorize(PERMISSIONS.BILLING_ADMIN), deleteService);

// Invoices
router.get("/invoices", authorize(PERMISSIONS.BILLING_VIEW), getInvoices);
router.get("/invoices/:id", authorize(PERMISSIONS.BILLING_VIEW), getInvoiceById);
router.post(
  "/invoices",
  authorize(PERMISSIONS.BILLING_CREATE),
  validateSchema(createInvoiceSchema),
  createInvoice,
);
router.patch(
  "/invoices/:id",
  authorize(PERMISSIONS.BILLING_UPDATE),
  validateSchema(updateInvoiceSchema),
  updateInvoice,
);
router.patch(
  "/invoices/:id/cancel",
  authorize(PERMISSIONS.BILLING_UPDATE),
  cancelInvoice,
);

// Payments & Receipts
router.post(
  "/invoices/:id/payments",
  authorize(PERMISSIONS.BILLING_PAYMENT),
  validateSchema(recordPaymentSchema),
  recordPayment,
);
router.get("/payments/:id", authorize(PERMISSIONS.BILLING_VIEW), getPaymentById);

export default router;
