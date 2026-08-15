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

  // moveActivesToPending()
  // movePendingsToMissed()


  // Verify pending tasks values
  // checkPendingsValues()

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

async function movePendingsToMissed() {
  try {
    const missed = await prisma.task.updateMany({
      where: {
        status: "pending",
        grace_period: 0,
      },
      data: { status: "missed" },
    });
    
    console.log(`${missed.count} tasks marked as missed.`);

  } catch (error) {
    console.error("Cron job: Moving pending tasks to missed failed:", error);
  }
}

async function checkPendingsValues() {
  try {
    let ctr = 0
    const now = new Date()
    const pendingTasks = await prisma.task.findMany({
      where: { status: "pending" },
    });

    if (pendingTasks.length === 0) return

    for (const t of pendingTasks) {
      const [new_value, new_grace_period] = validateTaskValue(t, now)
      if (new_value !== t.value) {
        await prisma.task.update({
          where: { task_id: t.task_id },
          data: {
            value: new_value,
            grace_period: new_grace_period
          }
        })
      }
      ctr++;
      console.log(`XXXXX\nTitle: ${t.title}.\ngrace period: ${t.grace_period}.\n`)
    }

    console.log(`${ctr} pending tasks rewards decremented.`)

  } catch (error) {
    console.error("Cron Job: Pending reward updates failed:", error);
  }
}

function validateTaskValue(task: Task, now: Date): any[] {
  let values, new_grace_period
  
  // How many 24h has the task been pending for
  const daysLate = (now.getTime() - task.deadline!.getTime()) / 3600000
  // const new_grace_period = task.grace_period - daysLate

  if (task.difficulty === "easy")
    new_grace_period = 1 - daysLate
    values = [5, 10]

  if (task.difficulty === "medium")
    new_grace_period = 3 - daysLate
    values = [4, 10, 14, 17]

  if (task.difficulty === "hard")
    new_grace_period = 5 - daysLate
    values = [6, 10, 14, 18, 21, 23]

  return [ values![new_grace_period!], new_grace_period ]
}