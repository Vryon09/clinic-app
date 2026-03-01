import { Router } from "express";
import {
  addPatient,
  deletePatient,
  getPatient,
  getPatients,
  searchPatients,
  updatePatient,
} from "../controller/patientController";

const router = Router();

router.get("/", getPatients);
router.get("/search", searchPatients);
router.get("/:id", getPatient);

router.post("/", addPatient);

router.patch("/:id", updatePatient);

router.delete("/:id", deletePatient);

export default router;
