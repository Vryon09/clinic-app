import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
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

router.use(verifyToken);

router.get("/patient/:patientId", getMedicalCertificatesByPatient);
router.get("/:id", getMedicalCertificateById);
router.post(
  "/",
  validateSchema(createMedicalCertificateSchema),
  createMedicalCertificate,
);
router.patch(
  "/:id",
  validateSchema(updateMedicalCertificateSchema),
  updateMedicalCertificate,
);
router.delete("/:id", deleteMedicalCertificate);

export default router;
