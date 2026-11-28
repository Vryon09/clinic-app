import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { requireSuperAdmin } from "../middleware/authorize";
import { validateSchema } from "../middleware/validateSchema";
import {
  createRoleSchema,
  updateRoleFeaturesSchema,
  updateRolePermissionsSchema,
  updateRoleSchema,
} from "../schemas/roleSchema";
import {
  createRole,
  deleteRole,
  getCatalog,
  getRoles,
  updateRole,
  updateRoleFeatures,
  updateRolePermissions,
} from "../controller/roleController";

const router = Router();

router.use(verifyToken, requireSuperAdmin);

router.get("/catalog", getCatalog);
router.get("/", getRoles);
router.post("/", validateSchema(createRoleSchema), createRole);
router.patch("/:id", validateSchema(updateRoleSchema), updateRole);
router.put(
  "/:id/permissions",
  validateSchema(updateRolePermissionsSchema),
  updateRolePermissions,
);
router.put(
  "/:id/features",
  validateSchema(updateRoleFeaturesSchema),
  updateRoleFeatures,
);
router.delete("/:id", deleteRole);

export default router;
