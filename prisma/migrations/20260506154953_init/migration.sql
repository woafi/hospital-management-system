/*
  Warnings:

  - A unique constraint covering the columns `[receptionists_id]` on the table `Receptionist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receptionists_id` to the `Receptionist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Receptionist" ADD COLUMN     "receptionists_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Receptionist_receptionists_id_key" ON "Receptionist"("receptionists_id");
