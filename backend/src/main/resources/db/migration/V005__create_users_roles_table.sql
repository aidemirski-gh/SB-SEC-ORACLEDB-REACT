-- ============================================
-- V005: Create Users-Roles Junction Table
-- Description: Many-to-many relationship between users and roles
-- ============================================

-- Create users_roles junction table
CREATE TABLE users_roles (
    user_id NUMBER(19) NOT NULL,
    role_id NUMBER(19) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    assigned_by VARCHAR2(100),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_users_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_users_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Comments
COMMENT ON TABLE users_roles IS 'Many-to-many relationship between users and roles';
COMMENT ON COLUMN users_roles.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN users_roles.role_id IS 'Foreign key to roles table';
COMMENT ON COLUMN users_roles.assigned_at IS 'Timestamp when role was assigned to user';
COMMENT ON COLUMN users_roles.assigned_by IS 'Username of admin who assigned the role';

-- Indexes
CREATE INDEX idx_users_roles_user ON users_roles(user_id);
CREATE INDEX idx_users_roles_role ON users_roles(role_id);

COMMIT;
