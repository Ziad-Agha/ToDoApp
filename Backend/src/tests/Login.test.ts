import request from "supertest";
import app from "../app";
import prisma from "../db/prisma";

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    // register a test user before all tests
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "testlogin@gmail.com",
        password: "testpassword",
      });
  });

  afterAll(async () => {
    // delete the test user after all tests
    await prisma.user.deleteMany({
      where: { email: "testlogin@gmail.com" },
    });
  });

  it("should return 401 if email is not registered", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "unregistered@gmail.com", password: "testpassword" });

    expect(res.status).toBe(401);
  });

  it("should return 401 for real email but wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testlogin@gmail.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });

  it("should return 200 and a token with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "testlogin@gmail.com", password: "testpassword" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
