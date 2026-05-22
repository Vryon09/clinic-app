import { Router } from "express";
import {
  addPatient,
  archivePatient,
  deletePatient,
  getArchivedPatients,
  getPatient,
  getPatients,
  restorePatient,
  searchPatients,
  updatePatient,
} from "../controller/patientController";
import { validateSchema } from "../middleware/validateSchema";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../schemas/patientSchema";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/", getPatients);
router.get("/search", searchPatients);
router.get("/archived", getArchivedPatients);
router.get("/:id", getPatient);

router.post("/", validateSchema(createPatientSchema), addPatient);

router.patch("/:id/archive", archivePatient);
router.patch("/:id/restore", restorePatient);
router.patch("/:id/update", validateSchema(updatePatientSchema), updatePatient);

router.delete("/:id", deletePatient);

export default router;
