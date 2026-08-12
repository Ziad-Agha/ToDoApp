import express from "express";
import cors from "cors";
import tasksRouter from "./routes/task.routes";
import authRouter from "./routes/auth.routes";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/tasks", tasksRouter);
app.use("/api/auth", authRouter);

export default app;