import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tasksRouter from "./routes/task.routes";
import authRouter from "./routes/auth.routes";
import cron from "node-cron";
import prisma from "./db/prisma";
dotenv.config();

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

cron.schedule("* * * * *", async () => {
  try {
    const updated = await prisma.task.updateMany({
      where: {
        status: "active",
        deadline: { lt: new Date() },
      },
      data: { status: "pending" },
    });
    if (updated.count > 0) {
      console.log(`${updated.count} tasks marked as pending`);
    }
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});
