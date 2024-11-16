-- CreateEnum
CREATE TYPE "UserLoanStatus" AS ENUM ('CLOSED', 'ACTIVE');

-- CreateTable
CREATE TABLE "UserLoan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "emiQty" INTEGER NOT NULL DEFAULT 0,
    "status" "UserLoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "lender" TEXT NOT NULL,
    "reason" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserLoan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserLoan_userId_idx" ON "UserLoan"("userId");

-- AddForeignKey
ALTER TABLE "UserLoan" ADD CONSTRAINT "UserLoan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
