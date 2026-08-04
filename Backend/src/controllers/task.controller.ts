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

  // start and end are received as UTC ISO strings,
  // since fetching from Postgres is done in UTC
  const start = new Date(req.query.start as string)
  const end = new Date(req.query.end as string)

  const tasks = await prisma.task.findMany({
    where: {
      user_id: req.user!.user_id,
      deadline: { gte: start, lte: end },
      status: { in: ["active", "pending"] },
    }
  })

  res.status(200).json(tasks)
}