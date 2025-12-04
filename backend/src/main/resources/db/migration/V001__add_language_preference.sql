-- ============================================
-- Multi-Language Support Migration
-- Database: Oracle
-- Description: Adds language_preference column to users table
-- ============================================

-- Add language_preference column
ALTER TABLE users ADD (
    language_preference VARCHAR2(10) DEFAULT 'en' NOT NULL
);

-- Add constraint to ensure valid language codes
ALTER TABLE users ADD CONSTRAINT chk_language_preference
    CHECK (language_preference IN ('en', 'bg'));

-- Add comment for documentation
COMMENT ON COLUMN users.language_preference IS
    'User preferred language: en (English) or bg (Bulgarian)';

-- Create index for potential performance optimization
CREATE INDEX idx_users_language ON users(language_preference);

-- Verification query (uncomment to run after migration)
-- SELECT column_name, data_type, data_default, nullable
-- FROM user_tab_columns
-- WHERE table_name = 'USERS' AND column_name = 'LANGUAGE_PREFERENCE';
