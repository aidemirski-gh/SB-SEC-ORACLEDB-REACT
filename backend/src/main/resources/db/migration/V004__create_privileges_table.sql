-- ============================================
-- V004: Create Privileges Table
-- Description: Create privileges table for RBAC system
-- ============================================

-- Create sequence
CREATE SEQUENCE privileges_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- Create privileges table
CREATE TABLE privileges (
    id NUMBER(19) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL UNIQUE,
    description VARCHAR2(255),
    category VARCHAR2(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Comments
COMMENT ON TABLE privileges IS 'System privileges for role-based access control';
COMMENT ON COLUMN privileges.name IS 'Unique privilege name (e.g., READ_CUSTOMERS, WRITE_CUSTOMERS)';
COMMENT ON COLUMN privileges.category IS 'Privilege category for grouping (e.g., CUSTOMERS, USERS, ROLES)';

-- Indexes
CREATE INDEX idx_privileges_name ON privileges(name);
CREATE INDEX idx_privileges_category ON privileges(category);

-- Auto-increment trigger
CREATE OR REPLACE TRIGGER privileges_bi
BEFORE INSERT ON privileges FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT privileges_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/

-- Auto-update trigger
CREATE OR REPLACE TRIGGER privileges_bu
BEFORE UPDATE ON privileges FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Insert default system privileges

-- Customer privileges
INSERT INTO privileges (name, description, category)
VALUES ('READ_CUSTOMERS', 'View customer information', 'CUSTOMERS');

INSERT INTO privileges (name, description, category)
VALUES ('CREATE_CUSTOMERS', 'Create new customers', 'CUSTOMERS');

INSERT INTO privileges (name, description, category)
VALUES ('UPDATE_CUSTOMERS', 'Update customer information', 'CUSTOMERS');

INSERT INTO privileges (name, description, category)
VALUES ('DELETE_CUSTOMERS', 'Delete customers', 'CUSTOMERS');

-- User privileges
INSERT INTO privileges (name, description, category)
VALUES ('READ_USERS', 'View user information', 'USERS');

INSERT INTO privileges (name, description, category)
VALUES ('CREATE_USERS', 'Create new users', 'USERS');

INSERT INTO privileges (name, description, category)
VALUES ('UPDATE_USERS', 'Update user information', 'USERS');

INSERT INTO privileges (name, description, category)
VALUES ('DELETE_USERS', 'Delete users', 'USERS');

INSERT INTO privileges (name, description, category)
VALUES ('MANAGE_USER_ROLES', 'Assign roles to users', 'USERS');

-- Role privileges
INSERT INTO privileges (name, description, category)
VALUES ('READ_ROLES', 'View role information', 'ROLES');

INSERT INTO privileges (name, description, category)
VALUES ('CREATE_ROLES', 'Create new roles', 'ROLES');

INSERT INTO privileges (name, description, category)
VALUES ('UPDATE_ROLES', 'Update role information', 'ROLES');

INSERT INTO privileges (name, description, category)
VALUES ('DELETE_ROLES', 'Delete roles', 'ROLES');

INSERT INTO privileges (name, description, category)
VALUES ('MANAGE_ROLE_PRIVILEGES', 'Assign privileges to roles', 'ROLES');

-- System privileges
INSERT INTO privileges (name, description, category)
VALUES ('SYSTEM_ADMIN', 'Full system administration access', 'SYSTEM');

COMMIT;
