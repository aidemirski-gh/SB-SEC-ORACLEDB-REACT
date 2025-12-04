-- ============================================
-- CRM Application - Test Data
-- Database: Oracle
-- Description: Sample data for testing and development
-- ============================================

-- ============================================
-- IMPORTANT: Passwords are BCrypt hashed
-- ============================================
-- To generate BCrypt passwords in Java:
-- BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
-- String hashed = encoder.encode("yourPassword");
--
-- Sample passwords used below:
-- admin123 -> $2a$10$rQ3fHvXqY7qYYqYqYqYqYe8JhGkGhGkGhGkGhGkGhGkGhGkGh (example hash)
-- user123  -> $2a$10$XQjKvZqUvANOqmF3gPxRJ.5K3ZJ7qVZJ7qVZJ7qVZJ7qVZ (example hash)
-- ============================================

-- Clear existing data (use with caution!)
-- DELETE FROM customers;
-- DELETE FROM users;

-- Reset sequences
-- ALTER SEQUENCE users_seq RESTART START WITH 1;
-- ALTER SEQUENCE customers_seq RESTART START WITH 1;

-- ============================================
-- USERS - Sample Test Data
-- ============================================

-- Admin User
-- Username: admin, Password: admin123
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, language_preference)
VALUES (
    'admin',
    'admin@crm.com',
    '$2a$10$rQ3fHvXqY7qYYqYqYqYqYe8JhGkGhGkGhGkGhGkGhGkGhGkGh',
    'Admin',
    'User',
    'ROLE_ADMIN',
    1,
    'en'
);

-- Regular User 1 (English)
-- Username: john.doe, Password: user123
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, language_preference)
VALUES (
    'john.doe',
    'john.doe@crm.com',
    '$2a$10$XQjKvZqUvANOqmF3gPxRJ.5K3ZJ7qVZJ7qVZJ7qVZJ7qVZ',
    'John',
    'Doe',
    'ROLE_USER',
    1,
    'en'
);

-- Regular User 2 (Bulgarian)
-- Username: maria.ivanova, Password: user123
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, language_preference)
VALUES (
    'maria.ivanova',
    'maria.ivanova@crm.com',
    '$2a$10$XQjKvZqUvANOqmF3gPxRJ.5K3ZJ7qVZJ7qVZJ7qVZJ7qVZ',
    'Maria',
    'Ivanova',
    'ROLE_USER',
    1,
    'bg'
);

-- Test User (Disabled)
-- Username: test.user, Password: test123
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, language_preference)
VALUES (
    'test.user',
    'test.user@crm.com',
    '$2a$10$XQjKvZqUvANOqmF3gPxRJ.5K3ZJ7qVZJ7qVZJ7qVZJ7qVZ',
    'Test',
    'User',
    'ROLE_USER',
    0,
    'en'
);

-- ============================================
-- CUSTOMERS - Sample Test Data
-- ============================================

-- Customer 1 - VIP
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES (
    'Jane',
    'Smith',
    'jane.smith@acmecorp.com',
    '+1-555-0123',
    'Acme Corporation',
    'VIP customer - Fortune 500 company. Contact for enterprise deals.'
);

-- Customer 2 - Regular
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES (
    'Robert',
    'Johnson',
    'robert.j@techstartup.io',
    '+1-555-0456',
    'Tech Startup Inc',
    'Early adopter. Interested in API integration.'
);

-- Customer 3 - International (Bulgaria)
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES (
    'Georgi',
    'Petrov',
    'g.petrov@sofiatech.bg',
    '+359-2-123-4567',
    'Sofia Tech Solutions',
    'Bulgarian client. Prefer communication in Bulgarian.'
);

-- Customer 4 - Individual
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES (
    'Emily',
    'Davis',
    'emily.davis@gmail.com',
    '+1-555-0789',
    NULL,
    'Freelance consultant. Small business package.'
);

-- Customer 5 - Enterprise
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES (
    'Michael',
    'Chen',
    'mchen@globalenterprise.com',
    '+86-10-1234-5678',
    'Global Enterprise Ltd',
    'Enterprise customer from China. Timezone: GMT+8'
);

-- Customer 6 - Potential Lead
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES (
    'Sarah',
    'Williams',
    'swilliams@midsize.com',
    '+1-555-0234',
    'Midsize Company LLC',
    'Trial period. Follow up in 30 days.'
);

-- Customer 7 - Support Case
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES (
    'David',
    'Brown',
    'd.brown@supportcase.net',
    '+44-20-7123-4567',
    'UK Support Ltd',
    'Active support ticket #12345. Priority: High'
);

-- Customer 8 - No phone/company
INSERT INTO customers (first_name, last_name, email, phone_number, company_name, notes)
VALUES (
    'Lisa',
    'Anderson',
    'lisa.a@email.com',
    NULL,
    NULL,
    'Basic plan customer. No additional details.'
);

-- ============================================
-- VERIFICATION
-- ============================================

-- Count records
SELECT 'Users: ' || COUNT(*) AS record_count FROM users;
SELECT 'Customers: ' || COUNT(*) AS record_count FROM customers;

-- View all users
SELECT id, username, email, first_name, last_name, role, enabled, language_preference
FROM users
ORDER BY id;

-- View all customers
SELECT id, first_name, last_name, email, company_name
FROM customers
ORDER BY id;

-- View users by language
SELECT language_preference, COUNT(*) as user_count
FROM users
GROUP BY language_preference;

-- View enabled vs disabled users
SELECT
    CASE enabled
        WHEN 1 THEN 'Enabled'
        WHEN 0 THEN 'Disabled'
    END AS status,
    COUNT(*) as user_count
FROM users
GROUP BY enabled;

COMMIT;

-- ============================================
-- NOTES
-- ============================================
-- The BCrypt password hashes above are EXAMPLES ONLY
-- You MUST generate real BCrypt hashes using your application
--
-- To test login in your application:
-- 1. Register a new user through the /api/auth/register endpoint
-- 2. The application will automatically hash the password
-- 3. Use those credentials for testing
--
-- Or use an online BCrypt generator and replace the hashes above
-- with real hashed versions of your test passwords
-- ============================================
