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
  
  // Move active tasks ==> pending
  try {
    const updated = await prisma.task.updateMany({
      where: {
        status: "active",
        deadline: { lt: new Date() },
      },
      data: { status: "pending", },
    });
    if (updated.count > 0) {
      console.log(`${updated.count} tasks marked as pending.`);
    }
  } catch (error) {
    console.error("Cron job: Moving active tasks to pending failed:", error);
  }

    // Move pending tasks ==> missed
  try {
    const missed = await prisma.task.updateMany({
      where: {
        status: "pending",
        grace_period: 0,
      },
      data: { status: "missed" },
    });
    if (missed.count > 0) {
      console.log(`${missed.count} tasks marked as missed.`);
    }
  } catch (error) {
    console.error("Cron job: Moving pending tasks to missed failed:", error);
  }
  
  
  // Verify pending tasks values
  try {
    const now = new Date()
    let ctr = 0
    const pendingTasks = await prisma.task.findMany({
      where: { status: "pending" },
    });

    if (pendingTasks.length === 0) return

    for (const task of pendingTasks) {
      const reward = getPendingReward(task.difficulty, task.grace_period)
      if (reward !== task.value) {
        await prisma.task.update({
          where: { task_id: task.task_id },
          data: {
            value: reward,
            grace_period: (task.grace_period! - 1)
          }
        })
      }
      ctr++;
      console.log(`XXXXX\nTitle: ${task.title}.\ngrace period: ${task.grace_period}.\n`)
    }

    console.log(`${ctr} pending tasks rewards decremented.`)

  } catch (error) {
    console.error("Cron Job: Pending reward updates failed:", error);
  }

});


function getPendingReward(difficulty: string, grace_period: number) {
  let decay

  if (difficulty === "easy")
    decay = [5, 10]
  if (difficulty === "medium")
    decay = [4, 10, 14, 17]
  if (difficulty === "hard")
    decay = [6, 10, 14, 18, 21, 23]

  return decay![grace_period]
}
