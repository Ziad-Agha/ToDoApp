import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";

describe("DELETE /api/tasks/deleteTask/:task_id", () => {
  let token: string;
  let task_id: string;

  // create a fresh task before each test since the successful delete test will consume it
  beforeAll(async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testdelete",
        email: "testdelete@gmail.com",
        password: "testpassword",
      });

    token = registerRes.body.token; // ← grab token directly from register
  });

  beforeEach(async () => {
    // no login needed — token already set in beforeAll
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

    task_id = taskRes.body.task_id;
  });

  // if a test fails before deleting the task, clean it up
  afterEach(async () => {
    await prisma.task.deleteMany({ where: { task_id } });
  });

  afterAll(async () => {
    const user = await prisma.user.findUnique({
      where: { email: "testdelete@gmail.com" },
    });
    if (user) {
      await prisma.user.delete({ where: { email: "testdelete@gmail.com" } });
    }
  });
  it("should return 401 without a token", async () => {
    const res = await request(app).delete(`/api/tasks/deleteTask/${task_id}`);

    expect(res.status).toBe(401);
  });

  it("should return 401 with an invalid token", async () => {
    const res = await request(app)
      .delete(`/api/tasks/deleteTask/${task_id}`)
      .set("Authorization", "Bearer faketoken123");

    expect(res.status).toBe(401);
  });

  it("should return 404 if task does not exist", async () => {
    const res = await request(app)
      .delete("/api/tasks/deleteTask/non-existent-task-id")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should return 200 and deleted task on success", async () => {
    const res = await request(app)
      .delete(`/api/tasks/deleteTask/${task_id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.task_id).toBe(task_id);
  });

  it("should no longer exist in the database after deletion", async () => {
    await request(app)
      .delete(`/api/tasks/deleteTask/${task_id}`)
      .set("Authorization", `Bearer ${token}`);

    const task = await prisma.task.findUnique({ where: { task_id } });
    expect(task).toBeNull();
  });
});
