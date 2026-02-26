import { Router } from "express";
import { addPatient, getPatients } from "../controller/patientController";

const router = Router();

router.get("/", getPatients);
router.post("/", addPatient);

export default router;
