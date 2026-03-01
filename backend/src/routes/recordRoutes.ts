import { Router } from "express";
import { addRecord, getRecords } from "../controller/recordController";

const router = Router();

router.get("/:id", getRecords);
router.post("/", addRecord);

export default router;
