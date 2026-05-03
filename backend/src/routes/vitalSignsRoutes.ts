import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { createVitalSignsSchema } from "../schemas/vitalSignsSchema";
import {
  addVitalSigns,
  getVitalSigns,
} from "../controller/vitalSignsController";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.post("/", validateSchema(createVitalSignsSchema), addVitalSigns);
router.get("/:recordId", getVitalSigns);

export default router;
