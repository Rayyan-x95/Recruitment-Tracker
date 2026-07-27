-- ========================================================
-- RECRUITMENT TRACKER DATABASE SCHEMA (DDL)
-- Supports MySQL 8.0+, PostgreSQL, and H2 Database Engines
-- ========================================================

-- DROP EXISTING TABLES IN REVERSE DEPENDENCY ORDER
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS feedbacks;
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS users;

-- 1. USERS TABLE (Authentication & Authorization)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'RECRUITER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CANDIDATES TABLE (Candidate Pipeline Records)
CREATE TABLE candidates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    skills TEXT NOT NULL,
    years_of_experience DOUBLE NOT NULL DEFAULT 0.0,
    current_company VARCHAR(150),
    target_role VARCHAR(150) NOT NULL,
    expected_ctc DOUBLE NOT NULL DEFAULT 0.0,
    resume_filename VARCHAR(255),
    resume_path VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INTERVIEWS TABLE (Interview Schedule & Rounds)
CREATE TABLE interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    interviewer_name VARCHAR(150) NOT NULL,
    round_type VARCHAR(50) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    location_or_link VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 4. FEEDBACKS TABLE (Interview Evaluation & Ratings)
CREATE TABLE feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    interviewer_name VARCHAR(150) NOT NULL,
    technical_rating INT NOT NULL CHECK (technical_rating BETWEEN 1 AND 5),
    communication_rating INT NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
    problem_solving_rating INT NOT NULL CHECK (problem_solving_rating BETWEEN 1 AND 5),
    overall_recommendation VARCHAR(50) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 5. OFFERS TABLE (Job Offer Management)
CREATE TABLE offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    base_salary DOUBLE NOT NULL,
    joining_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- INDEXES FOR SEARCH AND QUERY PERFORMANCE
CREATE INDEX idx_candidate_email ON candidates(email);
CREATE INDEX idx_candidate_status ON candidates(status);
CREATE INDEX idx_interview_scheduled ON interviews(scheduled_at);
CREATE INDEX idx_offer_status ON offers(status);
