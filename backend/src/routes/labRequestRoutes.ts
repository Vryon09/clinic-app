import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
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

router.use(verifyToken);

router.get("/patient/:patientId", getLabRequestsByPatient);
router.get("/:id", getLabRequestById);
router.post("/", validateSchema(createLabRequestSchema), createLabRequest);
router.patch("/:id", validateSchema(updateLabRequestSchema), updateLabRequest);
router.delete("/:id", deleteLabRequest);

export default router;
