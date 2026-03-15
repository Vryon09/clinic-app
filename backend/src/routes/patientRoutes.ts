import { Router } from "express";
import {
  addPatient,
  deletePatient,
  getPatient,
  getPatients,
  searchPatients,
  updatePatient,
} from "../controller/patientController";
import { validateSchema } from "../middleware/validateSchema";
import {
  createPatientSchema,
  updatePatientSchema,
} from "../schemas/patientSchema";

const router = Router();

router.get("/", getPatients);
router.get("/search", searchPatients);
router.get("/:id", getPatient);

router.post("/", validateSchema(createPatientSchema), addPatient);

router.patch("/:id", validateSchema(updatePatientSchema), updatePatient);

router.delete("/:id", deletePatient);

export default router;
