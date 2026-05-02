import { Router } from "express";
import {
  getClinicInfo,
  initClinicInfo,
  updateClinicInfo,
} from "../controller/clinicInfoController";

const router = Router();

router.get("/", getClinicInfo);
router.post("/init", initClinicInfo);
router.patch("/update", updateClinicInfo);

export default router;
