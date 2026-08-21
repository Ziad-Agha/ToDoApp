import type { Request, Response } from "express";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

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
    value,
  } = req.body;
  if (
    !title ||
    !difficulty ||
    !type ||
    !created_on ||
    !type ||
    !status ||
    isPrivate === null ||
    !value
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
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
        value,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.log(error + "gababagoooooooooooooooo");
    res.status(500).json({ error });
  }
}

// Updates the title, note, or privacy of a task.
export async function updateTask(req: Request, res: Response) {
  try {
    const { user_id } = req.user!;
    const task_id = req.params.task_id as string;
    const { title, note, isPrivate } = req.body;

    // validate body
    if (!title && note === undefined && isPrivate === undefined) {
      return res
        .status(400)
        .json({ error: "No valid fields provided to update" });
    }

    const updatedTask = await prisma.task.update({
      where: { task_id, user_id },
      data: { title, note, isPrivate },
    });

    res.json(updatedTask);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ error: "Task not found" });
    }
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ error });
  }
}

export async function getAllTasks(req: Request, res: Response) {
  try {
    const tasks = await prisma.task.findMany({
      where: { user_id: req.user!.user_id },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ error });
  }
}

export async function getCurrentDayTasks(req: Request, res: Response) {
  const start = new Date(req.query.start as string);
  const end = new Date(req.query.end as string);

  const tasks = await prisma.task.findMany({
    where: {
      user_id: req.user!.user_id,
      deadline: { gte: start, lte: end },
      status: { in: ["active", "pending"] },
    },
  });

  if (!tasks) return res.status(200).json({ error: "No tasks found." });
  res.status(200).json(tasks);
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const { user_id } = req.user!;
    const task_id = req.params.task_id as string;
    const deletedTask = await prisma.task.delete({
      where: { task_id, user_id },
    });
    res.status(200).json(deletedTask);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ error: "Task not found" });
    }
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({ error });
  }
}
