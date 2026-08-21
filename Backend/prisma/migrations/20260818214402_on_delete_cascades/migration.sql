-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
