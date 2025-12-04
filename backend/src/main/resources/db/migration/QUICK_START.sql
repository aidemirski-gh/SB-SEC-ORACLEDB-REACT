-- ============================================
-- CRM Application - Quick Start Script
-- Database: Oracle
-- Description: Minimal script to create tables quickly
-- ============================================

-- Create Sequences
CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE customers_seq START WITH 1 INCREMENT BY 1;

-- Create USERS table
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_users_enabled CHECK (enabled IN (0, 1)),
    CONSTRAINT chk_users_language CHECK (language_preference IN ('en', 'bg'))
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Create CUSTOMERS table
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

CREATE INDEX idx_customers_email ON customers(email);

-- Auto-increment triggers
CREATE OR REPLACE TRIGGER users_bi BEFORE INSERT ON users FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN SELECT users_seq.NEXTVAL INTO :NEW.id FROM dual; END IF;
END;
/

CREATE OR REPLACE TRIGGER customers_bi BEFORE INSERT ON customers FOR EACH ROW
BEGIN
    IF :NEW.id IS NULL THEN SELECT customers_seq.NEXTVAL INTO :NEW.id FROM dual; END IF;
END;
/

-- Auto-update timestamp triggers
CREATE OR REPLACE TRIGGER users_bu BEFORE UPDATE ON users FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER customers_bu BEFORE UPDATE ON customers FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

COMMIT;
