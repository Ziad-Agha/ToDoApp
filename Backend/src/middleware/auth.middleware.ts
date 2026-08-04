import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// verifies that request contains correct authorization header
// and that the token is valid by hashing the provided token's paylaod and header against the secret.
// pass the call to the appropriate endpoint after attaching the payload to the req. 
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      user_id: string;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
