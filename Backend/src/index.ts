import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";
import app from "./app";
import { manageTaskStatus } from "./services";
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
cron.schedule("* * * * *", async () => {
  manageTaskStatus();
});
