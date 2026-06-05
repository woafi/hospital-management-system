-- CreateEnum
CREATE TYPE "LogCategory" AS ENUM ('ENTITY', 'APPOINTMENT');

-- CreateTable
CREATE TABLE "DashboardLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" "LogCategory" NOT NULL,
    "message" TEXT NOT NULL,
    "entityId" TEXT,
    "appointmentId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DashboardLog_category_createdAt_idx" ON "DashboardLog"("category", "createdAt");
