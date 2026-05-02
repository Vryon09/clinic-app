import { Router } from "express";
import {
  getClinicInfo,
  initClinicInfo,
} from "../controller/clinicInfoController";

const router = Router();

router.get("/", getClinicInfo);
router.post("/init", initClinicInfo);

export default router;
