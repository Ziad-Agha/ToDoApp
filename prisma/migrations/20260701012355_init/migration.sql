-- CreateTable
CREATE TABLE "Task" (
    "taskid" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "difficulty" TEXT NOT NULL,
    "createdon" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "status" TEXT,
    "deadline" TIMESTAMP(3),
    "graceperiod" INTEGER,
    "frequency" INTEGER,
    "weekday" TEXT,
    "streak" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("taskid")
);
