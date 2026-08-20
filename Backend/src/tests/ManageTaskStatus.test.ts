import { manageTaskStatus } from "../services";
import prisma from "../db/prisma";
import request from "supertest";
import app from "../app";

describe("manageTaskStatus", () => {
  let token: string;
  let user_id: string;

  beforeEach(() => {
    jest.useFakeTimers({
      doNotFake: ["setTimeout", "setInterval", "nextTick"],
    });
  });

  afterEach(() => {
    jest.useRealTimers(); // ← restores the real system clock
  });

  beforeAll(async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "testcron",
      email: "testcron@gmail.com",
      password: "testpassword",
    });

    token = registerRes.body.token;

    const user = await prisma.user.findUnique({
      where: { email: "testcron@gmail.com" },
    });
    user_id = user!.user_id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany({ where: { user_id } });
    await prisma.user.delete({ where: { email: "testcron@gmail.com" } });
  });

  afterEach(async () => {
    await prisma.task.deleteMany({ where: { user_id } });
  });

  // ─── moveActivesToPending ───────────────────────────────

  it("should mark overdue active task as pending and reduce its value to 5 the next day", async () => {
    const oneDayAgo = new Date(Date.now() - 86400000);

    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Overdue Task",
        difficulty: "easy",
        type: "day",
        isPrivate: false,
        status: "active",
        frequency: 1,
        weekday: "Monday",
        created_on: new Date(),
        start_date: new Date(),
        deadline: oneDayAgo,
        value: 15, // ← active value
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.status).toBe("pending");
    expect(task?.value).toBe(5); // ← values[1] for easy, 1 day late
  });

  it("should mark overdue active task as pending with value 10 on same day", async () => {
    const justNow = new Date(Date.now() - 1000); // 1 second ago, daysLate = 0

    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Just Missed Task",
        difficulty: "easy",
        type: "day",
        isPrivate: false,
        status: "active",
        frequency: 1,
        weekday: "Monday",
        created_on: new Date(),
        start_date: new Date(),
        deadline: justNow,
        value: 15,
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.status).toBe("pending");
    expect(task?.value).toBe(10); // values[0] — same day
  });

  it("should not affect active tasks with future deadlines", async () => {
    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Future Task",
        difficulty: "easy",
        type: "day",
        isPrivate: false,
        status: "active",
        frequency: 1,
        weekday: "Monday",
        created_on: new Date(),
        start_date: new Date(),
        deadline: new Date("2099-01-01T00:00:00.000Z"), // future
        value: 15,
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.status).toBe("active");
  });

  // ─── validateTaskValue / checkPendingsValues ────────────

  it("should reduce value for easy task that is 1 day late", async () => {
    const oneDayAgo = new Date(Date.now() - 86400000 * 1);

    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Easy Late Task",
        difficulty: "easy",
        type: "day",
        isPrivate: false,
        status: "pending",
        frequency: 1,
        weekday: "Monday",
        created_on: new Date(),
        start_date: new Date(),
        deadline: oneDayAgo,
        value: 15,
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.value).toBe(5); // easy[1] = 5
  });

  it("should mark easy task as missed when 2+ days late", async () => {
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2);

    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Missed Easy Task",
        difficulty: "easy",
        type: "day",
        isPrivate: false,
        status: "pending",
        frequency: 1,
        weekday: "Monday",
        created_on: new Date(),
        start_date: new Date(),
        deadline: twoDaysAgo,
        value: 15,
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.status).toBe("missed");
    expect(task?.value).toBe(0);
  });

  it("should reduce value for medium task that is 2 days late", async () => {
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2);

    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Medium Late Task",
        difficulty: "medium",
        type: "day",
        isPrivate: false,
        status: "pending",
        frequency: 1,
        weekday: "Monday",
        created_on: new Date(),
        start_date: new Date(),
        deadline: twoDaysAgo,
        value: 20,
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.value).toBe(10); // medium[2] = 10
  });

  it("should mark hard task as missed when 6+ days late", async () => {
    const sixDaysAgo = new Date(Date.now() - 86400000 * 6);

    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Missed Hard Task",
        difficulty: "hard",
        type: "day",
        isPrivate: false,
        status: "pending",
        frequency: 1,
        weekday: "Monday",
        created_on: new Date(),
        start_date: new Date(),
        deadline: sixDaysAgo,
        value: 25,
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.status).toBe("missed");
    expect(task?.value).toBe(0);
  });

  it("should not affect tasks that are already missed", async () => {
    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Already Missed Task",
        difficulty: "easy",
        type: "day",
        isPrivate: false,
        status: "missed",
        frequency: 1,
        weekday: "Monday",
        created_on: new Date(),
        start_date: new Date(),
        deadline: new Date("2020-01-01T00:00:00.000Z"),
        value: 15,
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.status).toBe("missed"); // unchanged
  });

  it("should mark task as pending with values[0] when deadline just passed at 23:59", async () => {
    // freeze time at 00:01 the next day — deadline just passed 2 minutes ago
    jest.setSystemTime(new Date("2026-07-11T00:01:00.000Z"));

    const taskRes = await request(app)
      .post("/api/tasks/createTask")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Just Missed Deadline",
        difficulty: "easy",
        type: "day",
        isPrivate: false,
        status: "active",
        frequency: 1,
        weekday: "Friday",
        created_on: new Date("2026-07-10T00:00:00.000Z"),
        start_date: new Date("2026-07-10T00:00:00.000Z"),
        deadline: new Date("2026-07-10T23:59:00.000Z"), // ← 23:59 deadline
        value: 15,
      });

    await manageTaskStatus();

    const task = await prisma.task.findUnique({
      where: { task_id: taskRes.body.task_id },
    });
    expect(task?.status).toBe("pending");
    expect(task?.value).toBe(10); // daysLate = 0 → values[0]
  });
});
