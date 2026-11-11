import multer from "multer";
import os from "os";
import fs from "fs";
import path from "path";
import { prisma } from "../config/prisma";
import { UserRequest } from "../types/express";

const labResultsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const patientId = req.body.patientId;

    const dir = `uploads/lab-results`;

    // create folder if not exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const signatureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `uploads/signatures`;

    // create folder if not exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: async function (req: UserRequest, file, cb) {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
      },
    });

    if (!user) return;

    cb(null, Date.now() + "-" + user.username + ".png");
  },
});

export const uploadLabResults = multer({ storage: labResultsStorage });
export const uploadSignatures = multer({ storage: signatureStorage });

const logoStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dir = `uploads/logo`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `clinic-logo-${Date.now()}${ext}`);
  },
});

const logoFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (.png, .jpg, .jpeg, .webp, .svg) are allowed."));
  }
};

export const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: logoFileFilter,
});

const backupFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const isAllowed =
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed" ||
    file.mimetype === "application/zip-compressed" ||
    file.mimetype === "application/octet-stream" ||
    file.originalname.toLowerCase().endsWith(".zip") ||
    file.originalname.toLowerCase().endsWith(".enc") ||
    file.originalname.toLowerCase().endsWith(".csync.enc");

  if (!isAllowed) {
    cb(new Error("Only .zip or .enc backup files are allowed."));
    return;
  }

  cb(null, true);
};

export const uploadRestore = multer({
  dest: os.tmpdir(),
  fileFilter: backupFileFilter,
});
