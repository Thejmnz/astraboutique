-- Run this in Supabase SQL Editor to add sale columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS on_sale boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price integer;
