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

const router = Router();

router.use(verifyToken);

router.get("/", getClinicInfo);
router.post("/init", initClinicInfo);
router.patch("/update", updateClinicInfo);
router.post("/logo", uploadLogo.single("logo"), uploadClinicLogo);
router.delete("/logo", deleteClinicLogo);

export default router;
