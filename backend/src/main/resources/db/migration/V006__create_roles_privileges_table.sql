-- ============================================
-- V006: Create Roles-Privileges Junction Table
-- Description: Many-to-many relationship between roles and privileges
-- ============================================

-- Create roles_privileges junction table
CREATE TABLE roles_privileges (
    role_id NUMBER(19) NOT NULL,
    privilege_id NUMBER(19) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (role_id, privilege_id),
    CONSTRAINT fk_roles_privileges_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_roles_privileges_privilege FOREIGN KEY (privilege_id) REFERENCES privileges(id) ON DELETE CASCADE
);

-- Comments
COMMENT ON TABLE roles_privileges IS 'Many-to-many relationship between roles and privileges';
COMMENT ON COLUMN roles_privileges.role_id IS 'Foreign key to roles table';
COMMENT ON COLUMN roles_privileges.privilege_id IS 'Foreign key to privileges table';
COMMENT ON COLUMN roles_privileges.granted_at IS 'Timestamp when privilege was granted to role';

-- Indexes
CREATE INDEX idx_roles_privileges_role ON roles_privileges(role_id);
CREATE INDEX idx_roles_privileges_privilege ON roles_privileges(privilege_id);

-- ============================================
-- Assign default privileges to system roles
-- ============================================

-- ROLE_USER: Basic customer access
INSERT INTO roles_privileges (role_id, privilege_id)
SELECT r.id, p.id
FROM roles r, privileges p
WHERE r.name = 'ROLE_USER'
AND p.name IN ('READ_CUSTOMERS', 'CREATE_CUSTOMERS', 'UPDATE_CUSTOMERS', 'DELETE_CUSTOMERS');

-- ROLE_MANAGER: User + Some user management
INSERT INTO roles_privileges (role_id, privilege_id)
SELECT r.id, p.id
FROM roles r, privileges p
WHERE r.name = 'ROLE_MANAGER'
AND p.name IN (
    'READ_CUSTOMERS', 'CREATE_CUSTOMERS', 'UPDATE_CUSTOMERS', 'DELETE_CUSTOMERS',
    'READ_USERS', 'READ_ROLES'
);

-- ROLE_ADMIN: Full system access
INSERT INTO roles_privileges (role_id, privilege_id)
SELECT r.id, p.id
FROM roles r, privileges p
WHERE r.name = 'ROLE_ADMIN';

COMMIT;
