/*
  Warnings:

  - You are about to drop the column `creditsCost` on the `ExecutionPhase` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExecutionPhase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "node" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "inputs" TEXT,
    "outputs" TEXT,
    "creditsConsumed" INTEGER,
    "workflowExcutionId" TEXT NOT NULL,
    CONSTRAINT "ExecutionPhase_workflowExcutionId_fkey" FOREIGN KEY ("workflowExcutionId") REFERENCES "WorkflowExecution" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ExecutionPhase" ("completedAt", "createdAt", "id", "inputs", "name", "node", "number", "outputs", "status", "userId", "workflowExcutionId") SELECT "completedAt", "createdAt", "id", "inputs", "name", "node", "number", "outputs", "status", "userId", "workflowExcutionId" FROM "ExecutionPhase";
DROP TABLE "ExecutionPhase";
ALTER TABLE "new_ExecutionPhase" RENAME TO "ExecutionPhase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
