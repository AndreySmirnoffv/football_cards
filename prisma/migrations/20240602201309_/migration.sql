-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "rating" REAL,
    "inventory" TEXT NOT NULL DEFAULT '[]',
    "matchInventory" TEXT NOT NULL DEFAULT '[]',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isWaiting" BOOLEAN NOT NULL DEFAULT false,
    "isMatch" BOOLEAN NOT NULL DEFAULT false,
    "wonMatches" INTEGER NOT NULL DEFAULT 0,
    "looseMatches" INTEGER NOT NULL DEFAULT 0,
    "lastActionTime" BIGINT NOT NULL DEFAULT 0
);
