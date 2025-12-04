-- ============================================
-- Migrate Users Table to Use Role Foreign Key
-- Database: Oracle
-- Description: Changes users.role from VARCHAR2 to foreign key reference
-- ============================================

-- Step 1: Add new role_id column (nullable initially for migration)
ALTER TABLE users ADD (
    role_id NUMBER(19)
);

-- Step 2: Migrate existing role strings to role_id
-- Map ROLE_USER
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'ROLE_USER')
WHERE role = 'ROLE_USER' OR role IS NULL;

-- Map ROLE_ADMIN
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'ROLE_ADMIN')
WHERE role = 'ROLE_ADMIN';

-- Map ROLE_MANAGER
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'ROLE_MANAGER')
WHERE role = 'ROLE_MANAGER';

-- Handle any unknown roles by defaulting to ROLE_USER
UPDATE users
SET role_id = (SELECT id FROM roles WHERE name = 'ROLE_USER')
WHERE role_id IS NULL;

COMMIT;

-- Step 3: Make role_id NOT NULL and add foreign key constraint
ALTER TABLE users MODIFY role_id NOT NULL;

ALTER TABLE users ADD CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES roles(id);

-- Step 4: Create index on role_id for performance
CREATE INDEX idx_users_role_id ON users(role_id);

-- Step 5: Drop old role column and its constraint
ALTER TABLE users DROP COLUMN role CASCADE CONSTRAINTS;

-- Step 6: Add comment
COMMENT ON COLUMN users.role_id IS 'Foreign key to roles table';

-- Verification query
SELECT u.id, u.username, u.email, r.name as role_name, r.description as role_description
FROM users u
JOIN roles r ON u.role_id = r.id
ORDER BY u.id;

COMMIT;
