/*
  Warnings:

  - You are about to drop the column `department` on the `Doctor` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Doctor_department_idx";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "department";
