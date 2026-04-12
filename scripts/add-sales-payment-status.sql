ALTER TABLE sales ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
