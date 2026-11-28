import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";
import { validateSchema } from "../middleware/validateSchema";
import {
  createLabRequestSchema,
  updateLabRequestSchema,
} from "../schemas/labRequestSchema";
import {
  createLabRequest,
  deleteLabRequest,
  getLabRequestById,
  getLabRequestsByPatient,
  updateLabRequest,
} from "../controller/labRequestController";

const router = Router();

router.use(verifyToken, requireFeature("patients.labRequests"));

router.get("/patient/:patientId", getLabRequestsByPatient);
router.get("/:id", getLabRequestById);
router.post(
  "/",
  authorize(PERMISSIONS.LAB_REQUEST_MANAGE),
  validateSchema(createLabRequestSchema),
  createLabRequest,
);
router.patch(
  "/:id",
  authorize(PERMISSIONS.LAB_REQUEST_MANAGE),
  validateSchema(updateLabRequestSchema),
  updateLabRequest,
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.LAB_REQUEST_MANAGE),
  deleteLabRequest,
);

export default router;
