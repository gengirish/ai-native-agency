-- Add password_hash column to users for Auth.js credentials auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
