import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";

describe("POST /api/tasks/createTask", () => {
  let token: string;
  let task_id: string;

  // create token before testing
  beforeAll(async () => {
    const loginRes = await request(app).post("/api/auth/register").send({
      username: "testCreate",
      email: "testCreate@gmail.com",
      password: "testpassword",
    });

    token = loginRes.body.token;
  });

  // delete all created tasks after testing
  afterAll(async () => {
    const user = await prisma.user.findUnique({
      where: { email: "testCreate@gmail.com" },
    });
    if (user) {
      await prisma.task.deleteMany({ where: { user_id: user.user_id } });
      await prisma.user.delete({ where: { email: "testCreate@gmail.com" } });
    }
  });

  // test if fails
  it("should return 401 without a token", async () => {
    const res = await request(app)
      .post("/api/tasks/createTask")
      .send({ title: "Test Task" });
    expect(res.status).toBe(401);
  });
  // test if fails
  it("should return 401 with an invalid token", async () => {
    const res = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", "Bearer FakeToken")
      .send({ title: "Test Task" });
    expect(res.status).toBe(401);
  });

  // test it fails
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required fields");
  });

  // test it succeeds
  it("should return 201 with a valid token and correct body", async () => {
    const res = await request(app)
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
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Buy groceries");
    expect(res.body.task_id).toBeDefined();
  });
});
