import { Router } from "express";
import {
  addRecord,
  archiveRecord,
  deleteRecord,
  getArchivedRecords,
  getRecord,
  getRecords,
  restoreRecord,
  updateRecord,
} from "../controller/recordController";
import { validateSchema } from "../middleware/validateSchema";
import {
  createRecordSchema,
  updateRecordSchema,
} from "../schemas/recordSchema";
import { verifyToken } from "../middleware/verifyToken";
import { authorize } from "../middleware/authorize";

const router = Router();

router.use(verifyToken);

router.get("/archived", getArchivedRecords);
router.get("/:id", getRecords);
router.get("/:id/record", getRecord);
router.post(
  "/",
  authorize("record:create"),
  validateSchema(createRecordSchema),
  addRecord,
);
router.delete("/:id", authorize("record:delete"), deleteRecord);
router.patch("/:id/restore", restoreRecord);
router.patch(
  "/:id/update",
  authorize("record:update"),
  validateSchema(updateRecordSchema),
  updateRecord,
);
router.patch("/:id/archive", archiveRecord);

export default router;
