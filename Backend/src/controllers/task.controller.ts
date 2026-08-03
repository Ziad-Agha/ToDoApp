import type { Request, Response } from "express";
import prisma from "../db/prisma";

export async function createTask(req: Request, res: Response) {
  const user_id = req.user!.user_id;
  const {
    title,
    note,
    difficulty,
    created_on,
    type,
    start_date,
    status,
    deadline,
    frequency,
    weekday,
    isPrivate,
  } = req.body;

  const newTask = await prisma.task.create({
    data: {
      user: {
        connect: { user_id },
      },
      title,
      note,
      difficulty,
      created_on,
      type,
      start_date,
      status,
      deadline,
      frequency,
      weekday,
      isPrivate,
    },
  });
  res.status(201).json(newTask);
}

export async function getCurrentDayTasks(req: Request, res: Response) {
  const start = new Date(req.query.start as string)
  const end = new Date(req.query.end as string)

  console.log("In task.controller:\nStart: " + start + "\nEnd: " + end)
  console.log("Start UTC:", start.toISOString()+"\nEnd UTC: "+end.toISOString())

  const tasks = await prisma.task.findMany({
    where: {
      user_id: req.user!.user_id,
      deadline: { gte: start, lte: end },
      status: { in: ["active", "pending"] },
    }
  })

  res.status(200).json(tasks)
}


// NOT IN USE
export async function getActiveTasks(req: Request, res: Response) {
  const tasks = await prisma.task.findMany({
    where: {
      user_id: req.user!.user_id,
      status: { in: ["active", "pending"] }
    }
  })
  tasks.length > 0 ?
    res.status(200).json(tasks) :
    res.status(404).json({ error: "No tasks found." })
}