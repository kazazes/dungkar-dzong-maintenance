-- CreateTable
CREATE TABLE "MaintenanceRequest" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRequest_pkey" PRIMARY KEY ("id")
);
