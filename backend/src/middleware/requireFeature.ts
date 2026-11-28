import { NextFunction, Response } from "express";
import { UserRequest } from "../types/express";
import { effectiveFeatureState } from "../rbac/accessService";
import { FeatureKey } from "../rbac/features";

export function requireFeature(
  key: FeatureKey,
  opts: { readsAlwaysAllowed?: boolean } = {},
) {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    const access = req.access;
    if (!access) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (access.isSuperAdmin) {
      return next();
    }

    const state = effectiveFeatureState(access, key);
    const isRead = req.method === "GET" || req.method === "HEAD";

    if (state === "HIDDEN" && !(isRead && opts.readsAlwaysAllowed)) {
      return res.status(403).json({
        code: "FEATURE_HIDDEN",
        message: "This feature is not available for your role.",
      });
    }

    if (state === "DISABLED" && !isRead) {
      return res.status(403).json({
        code: "FEATURE_DISABLED",
        message: "This feature is read-only for your role.",
      });
    }

    return next();
  };
}
