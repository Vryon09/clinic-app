import { Router } from "express";
import {
  deleteClinicLogo,
  getClinicInfo,
  initClinicInfo,
  updateClinicInfo,
  uploadClinicLogo,
} from "../controller/clinicInfoController";
import { verifyToken } from "../middleware/verifyToken";
import { uploadLogo } from "../middleware/multer";
import { requireFeature } from "../middleware/requireFeature";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "../rbac/permissions";

const router = Router();

router.use(
  verifyToken,
  requireFeature("settings.general", { readsAlwaysAllowed: true }),
);

router.get("/", getClinicInfo);
router.post("/init", authorize(PERMISSIONS.CLINIC_UPDATE), initClinicInfo);
router.patch("/update", authorize(PERMISSIONS.CLINIC_UPDATE), updateClinicInfo);
router.post(
  "/logo",
  authorize(PERMISSIONS.CLINIC_UPDATE),
  uploadLogo.single("logo"),
  uploadClinicLogo,
);
router.delete("/logo", authorize(PERMISSIONS.CLINIC_UPDATE), deleteClinicLogo);

export default router;
