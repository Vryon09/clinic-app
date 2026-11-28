import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";
import { validateSchema } from "../middleware/validateSchema";
import {
  createMedicalCertificateSchema,
  updateMedicalCertificateSchema,
} from "../schemas/medicalCertificateSchema";
import {
  createMedicalCertificate,
  deleteMedicalCertificate,
  getMedicalCertificateById,
  getMedicalCertificatesByPatient,
  updateMedicalCertificate,
} from "../controller/medicalCertificateController";

const router = Router();

router.use(verifyToken, requireFeature("patients.medicalCertificates"));

router.get("/patient/:patientId", getMedicalCertificatesByPatient);
router.get("/:id", getMedicalCertificateById);
router.post(
  "/",
  authorize(PERMISSIONS.MED_CERT_MANAGE),
  validateSchema(createMedicalCertificateSchema),
  createMedicalCertificate,
);
router.patch(
  "/:id",
  authorize(PERMISSIONS.MED_CERT_MANAGE),
  validateSchema(updateMedicalCertificateSchema),
  updateMedicalCertificate,
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MED_CERT_MANAGE),
  deleteMedicalCertificate,
);

export default router;
