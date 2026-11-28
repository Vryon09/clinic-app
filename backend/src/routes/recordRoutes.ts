import { Router } from "express";
import {
  addRecord,
  archiveRecord,
  deleteRecord,
  getArchivedRecords,
  getRecord,
  getRecords,
  restoreRecord,
  updateRecord,
} from "../controller/recordController";
import { validateSchema } from "../middleware/validateSchema";
import {
  createRecordSchema,
  updateRecordSchema,
} from "../schemas/recordSchema";
import { verifyToken } from "../middleware/verifyToken";
import { authorize } from "../middleware/authorize";
import { requireFeature } from "../middleware/requireFeature";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.use(verifyToken);

router.get("/archived", requireFeature("settings.archive"), getArchivedRecords);
router.get("/:id", requireFeature("patients.consultations"), getRecords);
router.get("/:id/record", requireFeature("patients.consultations"), getRecord);
router.post(
  "/",
  requireFeature("patients.consultations"),
  authorize(PERMISSIONS.RECORD_CREATE),
  validateSchema(createRecordSchema),
  addRecord,
);
router.delete(
  "/:id",
  requireFeature("patients.consultations"),
  authorize(PERMISSIONS.RECORD_DELETE),
  deleteRecord,
);
router.patch(
  "/:id/restore",
  requireFeature("settings.archive"),
  authorize(PERMISSIONS.ARCHIVE_RESTORE),
  restoreRecord,
);
router.patch(
  "/:id/update",
  requireFeature("patients.consultations"),
  authorize(PERMISSIONS.RECORD_UPDATE),
  validateSchema(updateRecordSchema),
  updateRecord,
);
router.patch(
  "/:id/archive",
  requireFeature("patients.consultations"),
  authorize(PERMISSIONS.RECORD_ARCHIVE),
  archiveRecord,
);

export default router;
