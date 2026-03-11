-- Shopping Cart Model Migration
-- Run this in Supabase SQL Editor

-- Create carts table
CREATE TABLE IF NOT EXISTS "carts" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "items" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on userId
CREATE INDEX IF NOT EXISTS "carts_userId_idx" ON "carts"("userId");

-- Add comment
COMMENT ON TABLE "carts" IS 'Shopping cart data for authenticated users';
