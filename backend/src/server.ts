import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./config/prisma";
import patientRoutes from "./routes/patientRoutes.ts";
import recordRoutes from "./routes/recordRoutes.ts";
import vitalSignsRoutes from "./routes/vitalSignsRoutes.ts";
import recordMedicationRoutes from "./routes/recordMedicationRoutes.ts";
import labResultsRoutes from "./routes/labResultsRoutes.ts";
import googleAuthRoutes from "./routes/googleAuthRoutes.ts";
import backupRoutes from "./routes/backupRoutes.ts";

const app = express();

app.use(cors({ origin: ["http://localhost:5123"] }));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/vitalSigns", vitalSignsRoutes);
app.use("/api/recordMedication", recordMedicationRoutes);
app.use("/api/labResults", labResultsRoutes);
app.use("/api/labResults", labResultsRoutes);
app.use("/api/google", googleAuthRoutes);
app.use("/api/backup", backupRoutes);

app.listen(process.env.PORT, () =>
  console.log("Listening to PORT: " + process.env.PORT),
);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
