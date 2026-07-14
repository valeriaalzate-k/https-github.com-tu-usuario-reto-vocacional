-- CreateTable
CREATE TABLE "School" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RosterCode" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "topCareerId" TEXT
);
