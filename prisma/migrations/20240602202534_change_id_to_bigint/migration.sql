/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" BIGINT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_User" ("balance", "first_name", "id", "inventory", "isAdmin", "isMatch", "isWaiting", "lastActionTime", "last_name", "looseMatches", "matchInventory", "rating", "username", "wonMatches") SELECT "balance", "first_name", "id", "inventory", "isAdmin", "isMatch", "isWaiting", "lastActionTime", "last_name", "looseMatches", "matchInventory", "rating", "username", "wonMatches" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;
