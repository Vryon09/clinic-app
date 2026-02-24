import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma";

const app = express();

app.use(cors({ origin: ["http://localhost:5123"] }));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// app.use("/api/auth", authRoutes);
// app.use("/api/habits", habitRoutes);
// app.use("/api/moods", moodRoutes);
// app.use("/api/tags", tagRoutes);
// app.use("/api/pomodoro", pomodoroRoutes);
// app.use("/api/journals", journalRoutes);
// app.use("/api/transactions", transactionRoutes);

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
