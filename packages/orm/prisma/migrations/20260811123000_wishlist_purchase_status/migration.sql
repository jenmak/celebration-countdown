-- AlterTable
ALTER TABLE "gift_wishlist_item"
ADD COLUMN "purchase_status" TEXT NOT NULL DEFAULT 'SAVED';

-- Backfill from legacy boolean
UPDATE "gift_wishlist_item"
SET "purchase_status" = 'PURCHASED'
WHERE "is_purchased" = true;

-- CreateIndex
CREATE INDEX "gift_wishlist_item_contact_id_purchase_status_idx"
ON "gift_wishlist_item"("contact_id", "purchase_status");
