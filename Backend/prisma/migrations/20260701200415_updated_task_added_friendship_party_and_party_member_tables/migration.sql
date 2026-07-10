/*
  Warnings:

  - Made the column `start_date` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "start_date" SET NOT NULL,
ALTER COLUMN "start_date" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Friendship" (
    "user_id_1" TEXT NOT NULL,
    "user_id_2" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "since" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requested_by" TEXT,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("user_id_1","user_id_2")
);

-- CreateTable
CREATE TABLE "Party" (
    "party_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "leader_id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("party_id")
);

-- CreateTable
CREATE TABLE "PartyMember" (
    "party_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "PartyMember_pkey" PRIMARY KEY ("party_id","user_id")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_id_1_fkey" FOREIGN KEY ("user_id_1") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user_id_2_fkey" FOREIGN KEY ("user_id_2") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyMember" ADD CONSTRAINT "PartyMember_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Party"("party_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyMember" ADD CONSTRAINT "PartyMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
