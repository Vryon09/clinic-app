import { Router } from "express";
import { validateSchema } from "../middleware/validateSchema";
import { createVitalSignsSchema } from "../schemas/vitalSignsSchema";
import { addVitalSigns } from "../controller/vitalSignsController";

const router = Router();

router.post("/", validateSchema(createVitalSignsSchema), addVitalSigns);

export default router;
