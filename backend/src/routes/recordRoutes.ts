import { Router } from "express";
import {
  addRecord,
  deleteRecord,
  getRecord,
  getRecords,
  updateRecord,
} from "../controller/recordController";
import { validateSchema } from "../middleware/validateSchema";
import {
  createRecordSchema,
  updateRecordSchema,
} from "../schemas/recordSchema";

const router = Router();

router.get("/:id", getRecords);
router.get("/:id/record", getRecord);
router.post("/", validateSchema(createRecordSchema), addRecord);
router.delete("/:id", deleteRecord);
router.patch("/:id", validateSchema(updateRecordSchema), updateRecord);

export default router;
