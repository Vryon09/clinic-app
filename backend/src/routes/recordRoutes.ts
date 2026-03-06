import { Router } from "express";
import {
  addRecord,
  deleteRecord,
  getRecord,
  getRecords,
} from "../controller/recordController";

const router = Router();

router.get("/:id", getRecords);
router.get("/:id/record", getRecord);
router.post("/", addRecord);
router.delete("/:id", deleteRecord);

export default router;
