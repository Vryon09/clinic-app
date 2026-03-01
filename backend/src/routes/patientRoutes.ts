import { Router } from "express";
import {
  addPatient,
  deletePatient,
  getPatient,
  getPatients,
  searchPatients,
} from "../controller/patientController";

const router = Router();

router.get("/", getPatients);
router.get("/search", searchPatients);
router.get("/:id", getPatient);

router.post("/", addPatient);

router.delete("/:id", deletePatient);

export default router;
