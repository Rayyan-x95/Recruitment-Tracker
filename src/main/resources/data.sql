-- ==========================================
-- RECRUITMENT TRACKER - DATABASE SEED DATA
-- ==========================================

-- Insert Default Admin Account for Login
-- Password: 'admin123' (SHA-256 Hash: JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=)
INSERT INTO users (id, username, password, full_name, email, role, created_at)
VALUES 
(1, 'admin', 'JAvlGPq9JyTdtvBO6x2llnRI1+gxwIyPqCKAn3THIKk=', 'System Administrator', 'admin@rectracker.com', 'ADMIN', CURRENT_TIMESTAMP);

-- Mock candidate, interview, feedback, and offer records have been removed.
-- The application starts with a clean database ready for real data entry.
