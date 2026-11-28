import { Router } from "express";
import {
  deleteLabResult,
  getLabResultFile,
  getLabResults,
  uploadLabResult,
} from "../controller/labResultsController";
import { validateSchema } from "../middleware/validateSchema";
import { uploadLabResultSchema } from "../schemas/labResultSchema";
import { verifyToken } from "../middleware/verifyToken";
import { uploadLabResults } from "../middleware/multer";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.use(verifyToken, requireFeature("patients.labResults"));

router.get("/:id/file", getLabResultFile);
router.get("/:patientId", getLabResults);
router.post(
  "/upload",
  authorize(PERMISSIONS.LAB_RESULT_MANAGE),
  uploadLabResults.single("file"),
  validateSchema(uploadLabResultSchema),
  uploadLabResult,
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.LAB_RESULT_MANAGE),
  deleteLabResult,
);

export default router;
