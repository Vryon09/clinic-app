import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { createVitalSignsSchema } from "../schemas/vitalSignsSchema";
import {
  addVitalSigns,
  getVitalSigns,
} from "../controller/vitalSignsController";
import { verifyToken } from "../middleware/verifyToken";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.use(verifyToken, requireFeature("patients.consultations"));

router.post(
  "/",
  authorize(PERMISSIONS.RECORD_CREATE),
  validateSchema(createVitalSignsSchema),
  addVitalSigns,
);
router.get("/:recordId", getVitalSigns);

export default router;
