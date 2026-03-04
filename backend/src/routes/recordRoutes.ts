import { Router } from "express";
import {
  addRecord,
  deleteRecord,
  getRecords,
} from "../controller/recordController";

const router = Router();

router.get("/:id", getRecords);
router.post("/", addRecord);
router.delete("/:id", deleteRecord);

export default router;
