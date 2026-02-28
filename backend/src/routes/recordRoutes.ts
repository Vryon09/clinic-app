import { Router } from "express";
import { addRecord } from "../controller/recordController";

const router = Router();

router.post("/", addRecord);

export default router;
