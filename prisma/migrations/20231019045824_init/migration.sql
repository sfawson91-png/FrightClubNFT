-- CreateTable
CREATE TABLE "UserData" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);
