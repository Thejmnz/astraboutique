-- Run this in Supabase SQL Editor to add color_id to product_sizes
ALTER TABLE product_sizes ADD COLUMN IF NOT EXISTS color_id uuid REFERENCES colors(id);

-- Optional: remove the stock column from product_colors if it exists
-- ALTER TABLE product_colors DROP COLUMN IF EXISTS stock;
