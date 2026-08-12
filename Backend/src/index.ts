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

// NOTE: change task creation deadlines 
// to be exclusively in chunks of 30 minutes
cron.schedule("*/30 * * * *", async () => {
  try {
    const now = new Date()

    const overdueTasks = await prisma.task.findMany({
      where: {
        status: "active",
        deadline: { lt: now },
      },
    });

    if (overdueTasks.length === 0) return

    for (const task of overdueTasks) {

      // Determine how many days passed after deadline
      const hoursLate = (now.getTime() - task.deadline!.getTime()) / (1000 * 60 * 60)
      const pendingDays = Math.floor(hoursLate / 24)
      // Compute new decayed reward
      const reward = computeDecayedReward(task.difficulty, pendingDays)

      await prisma.task.update({
        where: { task_id: task.task_id },
        data: {
          status: "pending",
          value: reward,
        }
      })
    }

    console.log(`${overdueTasks.length} tasks marked pending and rewards updated`)

  } catch (error) {
    console.error("Cron job failed:", error);
  }
});

function computeDecayedReward(difficulty: string, pendingDays: number) {
  let decay

  if (difficulty === "easy") 
    decay = [15, 10, 5, 0]
  if (difficulty === "medium")
    decay = [20, 17, 14, 10, 4, 0]
  if (difficulty === "hard")
    decay = [25, 23, 21, 18, 14, 10, 6, 0]

  return decay![Math.min(pendingDays, decay!.length - 1)]
}
