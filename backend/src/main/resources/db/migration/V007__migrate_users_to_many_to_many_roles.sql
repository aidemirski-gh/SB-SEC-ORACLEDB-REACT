-- ============================================
-- V007: Migrate Users to Many-to-Many Roles
-- Description: Migrate existing role_id data to users_roles table and drop role_id column
-- ============================================

-- Migrate existing user-role relationships to users_roles table
INSERT INTO users_roles (user_id, role_id, assigned_by)
SELECT id, role_id, 'SYSTEM_MIGRATION'
FROM users
WHERE role_id IS NOT NULL;

COMMIT;

-- Verify migration
SELECT COUNT(*) as migrated_roles FROM users_roles;

-- Drop the old role_id foreign key constraint
ALTER TABLE users DROP CONSTRAINT fk_users_role;

-- Drop the old role_id column
ALTER TABLE users DROP COLUMN role_id;

-- Remove the index
DROP INDEX idx_users_role_id;

COMMIT;

-- Verification query to check users and their roles
SELECT u.id, u.username, r.name as role_name
FROM users u
JOIN users_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
ORDER BY u.username, r.name;
