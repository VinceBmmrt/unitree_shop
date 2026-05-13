-- AlterTable: make Configuration.userId nullable (required for anonymous quote configs)
ALTER TABLE "configurations" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable: add configurationId to QuoteItem
ALTER TABLE "quote_items" ADD COLUMN "configurationId" TEXT;

-- CreateIndex: unique constraint on configurationId (one config per quote line)
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_configurationId_key" UNIQUE ("configurationId");

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "configurations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
