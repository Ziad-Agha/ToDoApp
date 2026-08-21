import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";

describe("POST /api/auth/register", () => {
  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: "testuser@gmail.com" },
    });
  });

  it("should return 409 if email is already registered", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "meow", email: "meow@gmail.com", password: "meow" });

    expect(res.status).toBe(409);
  });

  it("should return 201 and a token on successful registration", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "testuser@gmail.com",
        password: "testpassword",
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should not store plain text password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "testuser@gmail.com",
        password: "testpassword",
      });

    const user = await prisma.user.findUnique({
      where: { email: "testuser@gmail.com" },
    });

    expect(user?.password).not.toBe("testpassword");
  });
});
