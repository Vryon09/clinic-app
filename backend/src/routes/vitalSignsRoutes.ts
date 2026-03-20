import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { createVitalSignsSchema } from "../schemas/vitalSignsSchema";
import {
  addVitalSigns,
  getVitalSign,
} from "../controller/vitalSignsController";

const router = Router();

router.post("/", validateSchema(createVitalSignsSchema), addVitalSigns);
router.get("/:recordId", getVitalSign);

export default router;
