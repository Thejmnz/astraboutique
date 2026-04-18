-- Run ALL of this in Supabase SQL Editor

-- 1. Add color_id column to product_sizes
ALTER TABLE product_sizes ADD COLUMN IF NOT EXISTS color_id uuid REFERENCES colors(id);

-- 2. Drop the old unique constraint on (product_id, size)
ALTER TABLE product_sizes DROP CONSTRAINT IF EXISTS product_sizes_product_id_size_key;

-- 3. Add new unique constraint that includes color_id
ALTER TABLE product_sizes ADD CONSTRAINT product_sizes_product_id_size_color_key UNIQUE (product_id, size, color_id);
