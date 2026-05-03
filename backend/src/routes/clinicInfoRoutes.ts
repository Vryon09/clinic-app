import { Router } from "express";
import {
  getClinicInfo,
  initClinicInfo,
  updateClinicInfo,
} from "../controller/clinicInfoController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/", getClinicInfo);
router.post("/init", initClinicInfo);
router.patch("/update", updateClinicInfo);

export default router;
