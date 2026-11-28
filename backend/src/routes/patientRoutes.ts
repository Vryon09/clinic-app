import { Router } from "express";
import {
  addPatient,
  archivePatient,
  deletePatient,
  getArchivedPatients,
  getPatient,
  getPatients,
  restorePatient,
  searchPatients,
  updatePatient,
} from "../controller/patientController";
import { validateSchema } from "../middleware/validateSchema";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../schemas/patientSchema";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.use(verifyToken);

router.get("/", requireFeature("patients"), getPatients);
router.get("/search", requireFeature("patients"), searchPatients);
router.get("/archived", requireFeature("settings.archive"), getArchivedPatients);
router.get("/:id", requireFeature("patients"), getPatient);

router.post(
  "/",
  requireFeature("patients"),
  authorize(PERMISSIONS.PATIENT_CREATE),
  validateSchema(createPatientSchema),
  addPatient,
);

router.patch(
  "/:id/archive",
  requireFeature("patients"),
  authorize(PERMISSIONS.PATIENT_ARCHIVE),
  archivePatient,
);
router.patch(
  "/:id/restore",
  requireFeature("settings.archive"),
  authorize(PERMISSIONS.ARCHIVE_RESTORE),
  restorePatient,
);
router.patch(
  "/:id/update",
  requireFeature("patients"),
  authorize(PERMISSIONS.PATIENT_UPDATE),
  validateSchema(updatePatientSchema),
  updatePatient,
);

router.delete(
  "/:id",
  requireFeature("patients"),
  authorize(PERMISSIONS.PATIENT_DELETE),
  deletePatient,
);

export default router;
