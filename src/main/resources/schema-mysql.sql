-- ==========================================
-- RECRUITMENT TRACKER - MYSQL SCHEMA SCRIPT
-- ==========================================

CREATE DATABASE IF NOT EXISTS rectracker_db;
USE rectracker_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL DEFAULT 'RECRUITER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    skills TEXT NOT NULL,
    years_of_experience DOUBLE NOT NULL DEFAULT 0,
    current_company VARCHAR(100),
    target_role VARCHAR(100) NOT NULL,
    expected_ctc DOUBLE,
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
    resume_filename VARCHAR(255),
    resume_path VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    interviewer_name VARCHAR(100) NOT NULL,
    round_type VARCHAR(50) NOT NULL,
    scheduled_at DATETIME NOT NULL,
    location_or_link VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 4. Feedbacks Table
CREATE TABLE IF NOT EXISTS feedbacks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    interview_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    interviewer_name VARCHAR(100) NOT NULL,
    technical_rating INT NOT NULL,
    communication_rating INT NOT NULL,
    problem_solving_rating INT NOT NULL,
    overall_recommendation VARCHAR(30) NOT NULL,
    comments TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

-- 5. Offers Table
CREATE TABLE IF NOT EXISTS offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    base_salary DOUBLE NOT NULL,
    joining_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
