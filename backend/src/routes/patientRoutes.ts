import { Router } from "express";
import {
  addPatient,
  getPatient,
  getPatients,
  searchPatients,
} from "../controller/patientController";

const router = Router();

router.get("/", getPatients);
router.get("/search", searchPatients);
router.get("/:id", getPatient);

router.post("/", addPatient);

export default router;
