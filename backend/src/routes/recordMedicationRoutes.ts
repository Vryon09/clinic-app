import { Router } from "express";
import { getRecordMedications } from "../controller/recordMedicationController";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";

const router = Router();

router.get(
  "/:recordId",
  verifyToken,
  requireFeature("patients.consultations"),
  getRecordMedications,
);

export default router;
