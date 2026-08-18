import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";

describe("PUT /api/tasks/updateTask/:task_id", () => {
  let token: string;
  let task_id: string;

  // get a token and create a real task before all tests
  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "meow@gmail.com", password: "meow" });

    token = loginRes.body.token;

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
        value: 5
      });

    task_id = taskRes.body.task_id;
  });

  // delete the test task after all tests
  afterAll(async () => {
    await prisma.task.delete({ where: { task_id } });
  });

  it("should return 401 without a token", async () => {
    const res = await request(app)
      .put(`/api/tasks/updateTask/${task_id}`)
      .send({ title: "Updated Title" });

    expect(res.status).toBe(401);
  });

  it("should return 401 with an invalid token", async () => {
    const res = await request(app)
      .put(`/api/tasks/updateTask/${task_id}`)
      .set("Authorization", "Bearer faketoken123")
      .send({ title: "Updated Title" });

    expect(res.status).toBe(401);
  });

  it("should return 404 if task does not exist", async () => {
    const res = await request(app)
      .put("/api/tasks/updateTask/non-existent-task-id")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title" });

    expect(res.status).toBe(404);
  });

  it("should return 400 if no valid fields are provided", async () => {
    const res = await request(app)
      .put(`/api/tasks/updateTask/${task_id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("should return 200 and updated task with valid body", async () => {
    const res = await request(app)
      .put(`/api/tasks/updateTask/${task_id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title", note: "Updated note", isPrivate: true });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
    expect(res.body.note).toBe("Updated note");
    expect(res.body.isPrivate).toBe(true);
  });

  it("should ignore fields that are not allowed to be updated", async () => {
    const res = await request(app)
      .put(`/api/tasks/updateTask/${task_id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title", deadline: "2099-01-01T00:00:00.000Z" });

    expect(res.status).toBe(200);
    expect(res.body.deadline).not.toBe("2099-01-01T00:00:00.000Z"); // deadline unchanged
  });
});