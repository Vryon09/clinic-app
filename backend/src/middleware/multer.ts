import multer from "multer";
import os from "os";
import fs from "fs";
import { prisma } from "../config/prisma";

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
  filename: async function (req, file, cb) {
    const userId = req.body.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
      },
    });

    if (!user) return;

    cb(null, Date.now() + "-" + user.username);
  },
});

export const uploadLabResults = multer({ storage: labResultsStorage });
export const uploadSignature = multer({ storage: signatureStorage });

export const uploadRestore = multer({
  dest: os.tmpdir(),
});
