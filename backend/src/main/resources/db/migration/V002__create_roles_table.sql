-- ============================================
-- Role Management System Migration
-- Database: Oracle
-- Description: Creates roles table and migrates existing user roles
-- ============================================

-- Create sequence for roles table
CREATE SEQUENCE roles_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- Create roles table
CREATE TABLE roles (
    id NUMBER(19) PRIMARY KEY,
    name VARCHAR2(50) NOT NULL UNIQUE,
    description VARCHAR2(255),
    is_system_role NUMBER(1) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_roles_system CHECK (is_system_role IN (0, 1))
);

-- Comments for roles table
COMMENT ON TABLE roles IS 'System and custom user roles';
COMMENT ON COLUMN roles.id IS 'Primary key - Role ID';
COMMENT ON COLUMN roles.name IS 'Unique role name (e.g., ROLE_USER, ROLE_ADMIN)';
COMMENT ON COLUMN roles.description IS 'Human-readable description of the role';
COMMENT ON COLUMN roles.is_system_role IS '1=system role (cannot delete), 0=custom role';
COMMENT ON COLUMN roles.created_at IS 'Timestamp when role was created';
COMMENT ON COLUMN roles.updated_at IS 'Timestamp when role was last updated';

-- Create indexes
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_roles_system ON roles(is_system_role);

-- Trigger for auto-increment ID
CREATE OR REPLACE TRIGGER roles_bi
BEFORE INSERT ON roles
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT roles_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/

-- Trigger for auto-update updated_at
CREATE OR REPLACE TRIGGER roles_bu
BEFORE UPDATE ON roles
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Insert default system roles
INSERT INTO roles (name, description, is_system_role)
VALUES ('ROLE_USER', 'Standard user with basic access', 1);

INSERT INTO roles (name, description, is_system_role)
VALUES ('ROLE_ADMIN', 'Administrator with full system access', 1);

INSERT INTO roles (name, description, is_system_role)
VALUES ('ROLE_MANAGER', 'Manager with elevated privileges', 1);

COMMIT;

-- Verification query
SELECT id, name, description, is_system_role
FROM roles
ORDER BY id;
