-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "_prisma_data_migrations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "migration_id" UUID NOT NULL,
    "migration_name" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (current_timestamp at time zone 'utc'),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "_prisma_data_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cognito_sub" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (current_timestamp at time zone 'utc'),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "photo_url" TEXT,
    "birthdate" DATE NOT NULL,
    "relationship" TEXT NOT NULL,
    "notes" TEXT,
    "amazon_gift_facets" JSONB,
    "amazon_facets_notes_hash" TEXT,
    "amazon_facets_generated_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (current_timestamp at time zone 'utc'),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_wishlist_item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contact_id" UUID NOT NULL,
    "product_name" TEXT NOT NULL,
    "brand" TEXT,
    "price" DECIMAL(10,2),
    "amazon_url" TEXT NOT NULL,
    "image_url" TEXT,
    "is_purchased" BOOLEAN NOT NULL DEFAULT false,
    "added_by_user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT (current_timestamp at time zone 'utc'),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "gift_wishlist_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_cognito_sub_key" ON "user"("cognito_sub");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "contact_user_id_relationship_idx" ON "contact"("user_id", "relationship");

-- CreateIndex
CREATE INDEX "gift_wishlist_item_contact_id_idx" ON "gift_wishlist_item"("contact_id");

-- CreateIndex
CREATE INDEX "gift_wishlist_item_added_by_user_id_idx" ON "gift_wishlist_item"("added_by_user_id");

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_wishlist_item" ADD CONSTRAINT "gift_wishlist_item_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_wishlist_item" ADD CONSTRAINT "gift_wishlist_item_added_by_user_id_fkey" FOREIGN KEY ("added_by_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
