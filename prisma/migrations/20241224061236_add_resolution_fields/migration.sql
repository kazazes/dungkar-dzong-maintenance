-- AlterTable
ALTER TABLE "MaintenanceRequest" ADD COLUMN     "resolutionNotes" TEXT,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "resolvedBy" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
