/*
  Warnings:

  - You are about to drop the column `frequency` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `streak` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `weekday` on the `Task` table. All the data in the column will be lost.
  - Made the column `status` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "frequency",
DROP COLUMN "start_date",
DROP COLUMN "streak",
DROP COLUMN "type",
DROP COLUMN "weekday",
ADD COLUMN     "isRegular" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET NOT NULL;
