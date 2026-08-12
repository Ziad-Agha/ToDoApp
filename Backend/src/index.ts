import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";
import prisma from "./db/prisma";
import app from "./app";

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

cron.schedule("* * * * *", async () => {
  try {
    const updated = await prisma.task.updateMany({
      where: {
        status: "active",
        deadline: { lt: new Date() },
      },
      data: { status: "pending" },
    });
    if (updated.count > 0) {
      console.log(`${updated.count} tasks marked as pending`);
    }
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});
