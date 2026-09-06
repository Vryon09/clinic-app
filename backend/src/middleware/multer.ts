import multer from "multer";
import os from "os";
import fs from "fs";
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

const zipFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const isZip =
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed" ||
    file.mimetype === "application/zip-compressed" ||
    file.mimetype === "application/octet-stream" ||
    file.originalname.toLowerCase().endsWith(".zip");

  if (!isZip) {
    cb(new Error("Only .zip backup files are allowed."));
    return;
  }

  cb(null, true);
};

export const uploadRestore = multer({
  dest: os.tmpdir(),
  fileFilter: zipFileFilter,
});
