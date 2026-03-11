-- Create Cart table for shopping cart persistence
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "carts" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "items" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on userId for faster lookups
CREATE INDEX IF NOT EXISTS "carts_userId_idx" ON "carts"("userId");

-- Verify the table was created
SELECT * FROM "carts" LIMIT 1;
