import request from "supertest";
import app from "../app";

describe("Post /api/auth/login", () => {
  it("should return 401 if email is not registered", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "unregisteredEmail", password: "Notarealpassord" });
    expect(res.status).toBe(401);
  });

  it("should return 401 for real email but wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "meow@gmail.com", password: "Notarealpassword" });
    expect(res.status).toBe(401);
  });
  it("should return 200 and a token with existing email and password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "meow@gmail.com", password: "meow" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
