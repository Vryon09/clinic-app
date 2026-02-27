import { Router } from "express";
import {
  addPatient,
  getPatient,
  getPatients,
} from "../controller/patientController";

const router = Router();

router.get("/", getPatients);
router.get("/:id", getPatient);
router.post("/", addPatient);

export default router;
