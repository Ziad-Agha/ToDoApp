import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";
import { Task } from "@prisma/client";


describe("PUT /api/tasks/getAllTasks", () => {
  let token: string;

  beforeAll(async () => {
    const loginRes = await request(app).post("/api/auth/register").send({
      username: "testGetAllTasks",
      email: "testGetAllTasks@gmail.com",
      password: "testpassword",
    });

    token = loginRes.body.token;
  });
  afterAll(async () => {
    const user = await prisma.user.findUnique({
      where: { email: "testGetAllTasks@gmail.com" },
    });
    if (user) {
      await prisma.task.deleteMany({ where: { user_id: user.user_id } });
      await prisma.user.delete({ where: { email: "testGetAllTasks@gmail.com" } });
    }
  });

  it("should return 401 without a token", async () => {
    const res = await request(app).get(`/api/tasks/getAllTasks`);
    expect(res.status).toBe(401);
  });

  it("should return 401 with an invalid token", async () => {
    const res = await request(app)
      .put(`/api/tasks/getAllTasks`)
      .set("Authorization", "Bearer faketoken123");

    expect(res.status).toBe(401);
  });

  it("should return 200 and empty array when user has no tasks", async () => {
    const res = await request(app)
      .get("/api/tasks/getAllTasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return 200 and an array of two tasks when the user has two tasks", async () => {
    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Buy groceries",
        note: "Don't forget milk",
        difficulty: "easy",
        created_on: new Date("2026-07-10T00:00:00.000Z"),
        start_date: new Date("2026-07-10T00:00:00.000Z"),
        deadline: new Date("2026-07-10T23:59:00.000Z"),
        weekday: "Thursday",
        type: "day",
        isPrivate: false,
        frequency: 1,
        status: "active",
        value: 5,
      });

    const task_id = taskRes.body.task_id;

    const taskRes2 = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Go gym",
        note: "Don't forget legs",
        difficulty: "easy",
        created_on: new Date("2026-07-10T00:00:00.000Z"),
        start_date: new Date("2026-07-10T00:00:00.000Z"),
        deadline: new Date("2026-07-10T23:59:00.000Z"),
        weekday: "Thursday",
        type: "day",
        isPrivate: false,
        frequency: 0,
        status: "pending",
        value: 5,
      });

    const task_id2 = taskRes2.body.task_id;

    const res = await request(app)
      .get("/api/tasks/getAllTasks")
      .set("Authorization", `Bearer ${token}`);

    const containedIds = res.body.map((task: Task) => task.task_id);

    expect(res.status).toBe(200);
    expect(containedIds).toHaveLength(2);
    res.body.forEach((task: Task) => {
      expect(task.status).toMatch(/active|pending/);
    });
    expect(containedIds).toContain(task_id);
    expect(containedIds).toContain(task_id2);
  });
});
