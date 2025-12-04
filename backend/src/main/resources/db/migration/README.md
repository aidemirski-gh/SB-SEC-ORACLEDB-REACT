# Database Migration Scripts

This directory contains Oracle Database DDL scripts for the CRM Application.

## Files

### 1. `V000__create_initial_schema.sql` (RECOMMENDED)
**Complete schema creation script with:**
- ✅ Sequences for auto-increment IDs
- ✅ Full table definitions with all columns
- ✅ Constraints (NOT NULL, UNIQUE, CHECK)
- ✅ Indexes for performance optimization
- ✅ Triggers for auto-increment and timestamp updates
- ✅ Comprehensive comments and documentation
- ✅ Verification queries
- ✅ Rollback script (commented out)

**Use this for:** Production setup, complete documentation, best practices

### 2. `V001__add_language_preference.sql`
**Migration script to add multi-language support:**
- Adds `language_preference` column to users table
- Adds constraints and indexes
- For users who already have a database and need to upgrade

**Use this for:** Upgrading existing database with the language feature

### 3. `QUICK_START.sql`
**Minimal script for rapid setup:**
- Essential tables and indexes only
- Minimal comments
- Fastest way to get started

**Use this for:** Development, testing, quick prototyping

## Tables Created

### USERS
- **Purpose:** Application users with authentication
- **Columns:** id, username, email, password, first_name, last_name, role, enabled, language_preference, created_at, updated_at
- **Indexes:** username, email, language_preference, created_at

### CUSTOMERS
- **Purpose:** Customer information and contacts
- **Columns:** id, first_name, last_name, email, phone_number, company_name, notes, created_at, updated_at
- **Indexes:** email, last_name, company_name, created_at

## How to Run

### Option 1: SQL*Plus
```bash
sqlplus username/password@database
SQL> @V000__create_initial_schema.sql
```

### Option 2: SQL Developer
1. Open SQL Developer
2. Connect to your Oracle database
3. Open the SQL script file
4. Click "Run Script" (F5)

### Option 3: Command Line
```bash
sqlplus username/password@database @V000__create_initial_schema.sql
```

## Execution Order

**For NEW Database:**
1. Run `V000__create_initial_schema.sql` (includes language support)
   - OR run `QUICK_START.sql` for minimal setup

**For EXISTING Database (Upgrade):**
1. Your database already has users and customers tables
2. Run `V001__add_language_preference.sql` to add multi-language support

## Verification

After running the scripts, verify the installation:

```sql
-- Check tables
SELECT table_name FROM user_tables
WHERE table_name IN ('USERS', 'CUSTOMERS');

-- Check sequences
SELECT sequence_name FROM user_sequences
WHERE sequence_name IN ('USERS_SEQ', 'CUSTOMERS_SEQ');

-- Check table structure
DESC users;
DESC customers;

-- Test insert
INSERT INTO users (username, email, password)
VALUES ('test', 'test@example.com', 'test123');
SELECT * FROM users;
ROLLBACK; -- Or COMMIT if you want to keep it
```

## Rollback

If you need to remove everything:

```sql
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
```

## Data Types Mapping

| Java/JPA Type | Oracle Type | Notes |
|---------------|-------------|-------|
| Long (ID) | NUMBER(19) | Auto-increment via sequence |
| String (50) | VARCHAR2(50) | Username |
| String (255) | VARCHAR2(255) | Email, password |
| String (500) | VARCHAR2(500) | Notes |
| boolean | NUMBER(1) | 0=false, 1=true |
| LocalDateTime | TIMESTAMP | Default CURRENT_TIMESTAMP |

## Default Values

- **role:** 'ROLE_USER'
- **enabled:** 1 (true)
- **language_preference:** 'en' (English)
- **created_at:** CURRENT_TIMESTAMP
- **updated_at:** CURRENT_TIMESTAMP

## Constraints

- **Users username:** 3-50 characters, unique
- **Users email:** Unique, not null
- **Users language_preference:** Must be 'en' or 'bg'
- **Customers email:** Unique, not null
- **All IDs:** Auto-generated from sequences

## Support

- Oracle Database 11g or higher
- Compatible with Spring Boot 3.x + JPA
- Uses IDENTITY generation strategy with triggers
