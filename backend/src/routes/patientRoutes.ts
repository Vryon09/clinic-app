import { Router } from "express";
import { getPatients } from "../controller/patientController";

const router = Router();

router.get("/", getPatients);

export default router;
