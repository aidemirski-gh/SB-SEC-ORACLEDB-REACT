-- ============================================
-- CRM Application - Complete Database Schema
-- Database: Oracle
-- Description: Creates all tables, sequences, indexes, and constraints
-- ============================================

-- ============================================
-- SEQUENCES
-- ============================================

-- Sequence for USERS table
CREATE SEQUENCE users_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- Sequence for CUSTOMERS table
CREATE SEQUENCE customers_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- ============================================
-- TABLES
-- ============================================

-- --------------------------------------------
-- USERS Table
-- --------------------------------------------
CREATE TABLE users (
    id NUMBER(19) PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    email VARCHAR2(255) NOT NULL UNIQUE,
    password VARCHAR2(255) NOT NULL,
    first_name VARCHAR2(100),
    last_name VARCHAR2(100),
    role VARCHAR2(50) DEFAULT 'ROLE_USER' NOT NULL,
    enabled NUMBER(1) DEFAULT 1 NOT NULL,
    language_preference VARCHAR2(10) DEFAULT 'en' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Comments for USERS table
COMMENT ON TABLE users IS 'Application users with authentication details';
COMMENT ON COLUMN users.id IS 'Primary key - User ID';
COMMENT ON COLUMN users.username IS 'Unique username for login (3-50 characters)';
COMMENT ON COLUMN users.email IS 'Unique email address';
COMMENT ON COLUMN users.password IS 'BCrypt hashed password';
COMMENT ON COLUMN users.first_name IS 'User first name (optional)';
COMMENT ON COLUMN users.last_name IS 'User last name (optional)';
COMMENT ON COLUMN users.role IS 'User role (default: ROLE_USER)';
COMMENT ON COLUMN users.enabled IS 'Account enabled flag (1=enabled, 0=disabled)';
COMMENT ON COLUMN users.language_preference IS 'User preferred language: en (English) or bg (Bulgarian)';
COMMENT ON COLUMN users.created_at IS 'Timestamp when user was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when user was last updated';

-- Constraints for USERS table
ALTER TABLE users ADD CONSTRAINT chk_users_enabled
    CHECK (enabled IN (0, 1));

ALTER TABLE users ADD CONSTRAINT chk_users_language
    CHECK (language_preference IN ('en', 'bg'));

ALTER TABLE users ADD CONSTRAINT chk_users_username_length
    CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 50);

-- Indexes for USERS table
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_language ON users(language_preference);
CREATE INDEX idx_users_created_at ON users(created_at);

-- --------------------------------------------
-- CUSTOMERS Table
-- --------------------------------------------
CREATE TABLE customers (
    id NUMBER(19) PRIMARY KEY,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    email VARCHAR2(255) NOT NULL UNIQUE,
    phone_number VARCHAR2(50),
    company_name VARCHAR2(200),
    notes VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Comments for CUSTOMERS table
COMMENT ON TABLE customers IS 'Customer information and contacts';
COMMENT ON COLUMN customers.id IS 'Primary key - Customer ID';
COMMENT ON COLUMN customers.first_name IS 'Customer first name';
COMMENT ON COLUMN customers.last_name IS 'Customer last name';
COMMENT ON COLUMN customers.email IS 'Unique customer email address';
COMMENT ON COLUMN customers.phone_number IS 'Customer phone number (optional)';
COMMENT ON COLUMN customers.company_name IS 'Customer company name (optional)';
COMMENT ON COLUMN customers.notes IS 'Additional notes about customer (max 500 chars)';
COMMENT ON COLUMN customers.created_at IS 'Timestamp when customer was created';
COMMENT ON COLUMN customers.updated_at IS 'Timestamp when customer was last updated';

-- Indexes for CUSTOMERS table
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_last_name ON customers(last_name);
CREATE INDEX idx_customers_company ON customers(company_name);
CREATE INDEX idx_customers_created_at ON customers(created_at);

-- ============================================
-- TRIGGERS FOR AUTO-INCREMENT
-- ============================================

-- Trigger for USERS table - auto-increment ID
CREATE OR REPLACE TRIGGER users_bi
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT users_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/

-- Trigger for CUSTOMERS table - auto-increment ID
CREATE OR REPLACE TRIGGER customers_bi
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN
        SELECT customers_seq.NEXTVAL INTO :NEW.id FROM dual;
    END IF;
END;
/

-- ============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMP
-- ============================================

-- Trigger for USERS table - auto-update updated_at
CREATE OR REPLACE TRIGGER users_bu
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Trigger for CUSTOMERS table - auto-update updated_at
CREATE OR REPLACE TRIGGER customers_bu
BEFORE UPDATE ON customers
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- ============================================
-- SAMPLE DATA (OPTIONAL - Uncomment to use)
-- ============================================

-- Sample admin user (password: admin123)
-- Password is BCrypt hashed
/*
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, language_preference)
VALUES ('admin', 'admin@crm.com', '$2a$10$XQjKvZqUvANOqmF3gPxRJ.5K3ZJ7qVZJ7qVZJ7qVZJ7qVZJ7qVZ', 'Admin', 'User', 'ROLE_ADMIN', 1, 'en');

-- Sample regular user (password: user123)
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, language_preference)
VALUES ('user1', 'user1@crm.com', '$2a$10$XQjKvZqUvANOqmF3gPxRJ.5K3ZJ7qVZJ7qVZJ7qVZJ7qVZJ7qVZ', 'John', 'Doe', 'ROLE_USER', 1, 'en');

-- Sample customer
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES ('Jane', 'Smith', 'jane.smith@example.com', '+1-555-0123', 'Acme Corp', 'VIP customer');
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables were created
SELECT table_name FROM user_tables WHERE table_name IN ('USERS', 'CUSTOMERS') ORDER BY table_name;

-- Verify sequences were created
SELECT sequence_name FROM user_sequences WHERE sequence_name IN ('USERS_SEQ', 'CUSTOMERS_SEQ') ORDER BY sequence_name;

-- Verify triggers were created
SELECT trigger_name FROM user_triggers WHERE trigger_name LIKE '%_BI' OR trigger_name LIKE '%_BU' ORDER BY trigger_name;

-- View table structures
DESC users;
DESC customers;

-- ============================================
-- ROLLBACK SCRIPT (Use if you need to drop everything)
-- ============================================

/*
-- Drop triggers
DROP TRIGGER users_bi;
DROP TRIGGER users_bu;
DROP TRIGGER customers_bi;
DROP TRIGGER customers_bu;

-- Drop tables
DROP TABLE customers CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;

-- Drop sequences
DROP SEQUENCE customers_seq;
DROP SEQUENCE users_seq;
*/

COMMIT;
