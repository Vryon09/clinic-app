import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma";
import patientRoutes from "./routes/patientRoutes.ts";
import recordRoutes from "./routes/recordRoutes.ts";

const app = express();

app.use(cors({ origin: ["http://localhost:5123"] }));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);

// app.use(errorHandler);

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
