import type { Request, Response } from "express";
import prisma from "../db/prisma";
import { connect } from "node:http2";


let nextId = 1;

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

// INACTIVE
export async function getDailyTasks(req: Request, res: Response) {

  console.log("user_id:" + req.user!.user_id)
  console.log("start:" + req.query.start)
  console.log("end:" + req.query.end)

  const user_id = req.user!.user_id
  const start = new Date(req.query.start as string)
  const end = new Date(req.query.end as string)


  const tasks = await prisma.task.findMany({
    where: {
      user_id: user_id,
      deadline: {
        gte: start,
        lte: end
      }
    }
  })
  // Split tasks across 3
  // const regularTasks = []
  // const uniqueTasks = []
  // const pending = []


  // console.log(tasks)
  console.log("TASKS RETURNED: \n" + JSON.stringify(tasks))

  if (!tasks) return res.status(404).json({ error: "No tasks found." })
  res.status(200).json(tasks)
}

// TODO: Get active tasks within a certain window, not all user tasks
// Also possibly finding a better name for this function
export async function getActiveTasks(req: Request, res: Response) {
  const tasks = await prisma.task.findMany({
    where: { 
      user_id: req.user!.user_id, 
      status: { in: ["active", "pending"] } }
  })
  // console.log("TASKS RETURNED: \n" + JSON.stringify(tasks))
  tasks.length > 0 ?
    res.status(200).json(tasks) :
    res.status(404).json({ error: "No tasks found." })
}