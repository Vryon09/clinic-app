import { Router } from "express";
import {
  addCase,
  archiveCase,
  getArchivedCases,
  getCases,
  restoreCase,
  updateCase,
} from "../controller/caseController";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.use(verifyToken);

router.get("/archived", requireFeature("settings.archive"), getArchivedCases);
router.get("/:patientId", requireFeature("patients.consultations"), getCases);

router.post(
  "/:patientId",
  requireFeature("patients.consultations"),
  authorize(PERMISSIONS.CASE_MANAGE),
  addCase,
);

router.patch(
  "/:id/archive",
  requireFeature("patients.consultations"),
  authorize(PERMISSIONS.CASE_MANAGE),
  archiveCase,
);
router.patch(
  "/:id/restore",
  requireFeature("settings.archive"),
  authorize(PERMISSIONS.ARCHIVE_RESTORE),
  restoreCase,
);

router.patch(
  "/:patientId/:caseId",
  requireFeature("patients.consultations"),
  authorize(PERMISSIONS.CASE_MANAGE),
  updateCase,
);

export default router;
