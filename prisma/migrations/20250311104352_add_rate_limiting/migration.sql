-- CreateTable
CREATE TABLE "FaucetRequest" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FaucetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPromptUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyPromptUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FaucetRequest_walletAddress_idx" ON "FaucetRequest"("walletAddress");

-- CreateIndex
CREATE INDEX "DailyPromptUsage_userId_date_idx" ON "DailyPromptUsage"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPromptUsage_userId_date_key" ON "DailyPromptUsage"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyPromptUsage" ADD CONSTRAINT "DailyPromptUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
