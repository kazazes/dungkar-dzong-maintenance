/*
  Warnings:

  - Added the required column `details` to the `MaintenanceRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MaintenanceRequest" ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "imagePath" TEXT;
