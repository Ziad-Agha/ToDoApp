import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tasksRouter from "./routes/task.routes";
import authRouter from "./routes/auth.routes";
import cron from "node-cron";
import prisma from "./db/prisma";
import { Task } from "@prisma/client";
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
  moveActivesToPending()
  await new Promise(r => setTimeout(r, 1000));
  checkPendingsValues()
});

async function moveActivesToPending() {
  try {
    const updated = await prisma.task.updateMany({
      where: {
        status: "active",
        deadline: { lt: new Date() },
      },
      data: { status: "pending", },
    });

    console.log(`${updated.count} tasks marked as pending.`);

  } catch (error) {
    console.error("Cron job: Moving active tasks to pending failed:", error);
  }
}

async function checkPendingsValues() {
  try {
    let pnd_ctr = 0, msd_ctr = 0
    const now = new Date()
    const pendingTasks = await prisma.task.findMany({
      where: { status: "pending" },
    });

    if (pendingTasks.length === 0) return

    for (const t of pendingTasks) {
      const new_value = validateTaskValue(t, now)
      if (new_value === 0 ) {
        await prisma.task.update ({
          where: { task_id: t.task_id },
          data: { 
            status: "missed",
            value: 0,
          }
        })
        msd_ctr++
      }

      if (new_value !== t.value) {
        await prisma.task.update({
          where: { task_id: t.task_id },
          data: { value: new_value }
        })
        pnd_ctr++
      }
    }

    console.log(`\n${pnd_ctr} tasks lost value. ${msd_ctr} tasks marked as missed.\n`)

  } catch (error) {
    console.error("Cron Job: Pending-rewards updates failed:", error);
  }
}

function validateTaskValue(task: Task, now: Date): number {
  let values
  if (task.difficulty === "easy")
    values = [10, 5]
  if (task.difficulty === "medium")
    values = [17, 14, 10, 4]
  if (task.difficulty === "hard")
    values = [23, 21, 18, 14, 10, 6]
  
  // How many 24h has the task been pending for?
  const daysLate = Math.floor((now.getTime() - task.deadline!.getTime()) / 86400000)

  console.log(`Task name: ${task.title}. Days late: ${daysLate}. New value: ${values![daysLate]}`)
  // Return value corresponding to # of days late
  if (daysLate > values!.length)
    return 0
  else 
    return values![daysLate]
}