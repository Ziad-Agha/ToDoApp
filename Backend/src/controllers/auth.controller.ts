import type { Request, Response } from "express";
import prisma from "../db/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// recieves request body and verifies if then email already exists.
// creates user record in the database.
//
export async function register(req: Request, res: Response) {
  const { email, username, password } = req.body;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return res.status(409).json({ error: "email already in use" });
  }
  // creates hashed pass
  const hashed_pass = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashed_pass,
    },
  });

  // creates token including signature, jwt header, user_id.
  // signature is a combination of user_id, header and secret.
  const token = jwt.sign(
    { user_id: newUser.user_id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );
  res.status(201).json({ token });
}

// similar to register im too lazy.
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  res.json({ token });
}
