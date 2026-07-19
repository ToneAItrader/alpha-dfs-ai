-- CreateTable
CREATE TABLE "SimulationRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "runId" TEXT,
    "slateId" TEXT,
    "simulationCount" INTEGER NOT NULL DEFAULT 10000,
    "fieldSize" INTEGER,
    "fieldPercentile" REAL,
    "topOnePercentRate" REAL,
    "cashRate" REAL,
    "cashThreshold" REAL,
    "seed" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'complete',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME
);
