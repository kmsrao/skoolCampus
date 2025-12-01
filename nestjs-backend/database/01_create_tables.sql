-- ============================================
-- SkoolCampus Database Schema for PostgreSQL
-- Database: skoolcampus
-- ============================================

-- Connect to the skoolcampus database first
-- psql -U postgres -d skoolcampus -f 01_create_tables.sql

-- ============================================
-- 1. Authentication & User Management Tables
-- ============================================

-- Login Credentials Table
CREATE TABLE IF NOT EXISTS login_credential (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INTEGER NOT NULL, -- 1=Superadmin, 2=Admin, 3=Teacher, 4=Accountant, 5=Librarian, 6=Parent, 7=Student
    user_id INTEGER NOT NULL,
    active SMALLINT DEFAULT 1, -- 1=Active, 0=Inactive
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login Log Table
CREATE TABLE IF NOT EXISTS login_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role INTEGER NOT NULL,
    ip VARCHAR(45) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    browser VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    branch_id INTEGER NOT NULL
);

-- Reset Password Table
CREATE TABLE IF NOT EXISTS reset_password (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    login_credential_id INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Branch/School Management Tables
-- ============================================

-- Branch Table
CREATE TABLE IF NOT EXISTS branch (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    address TEXT,
    mobileno VARCHAR(20),
    email VARCHAR(255),
    status SMALLINT DEFAULT 1,
    translation VARCHAR(50),
    student_login SMALLINT DEFAULT 1,
    parent_login SMALLINT DEFAULT 1,
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    youtube_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Global Settings Table
CREATE TABLE IF NOT EXISTS global_settings (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    address TEXT,
    mobileno VARCHAR(20),
    email VARCHAR(255),
    translation VARCHAR(50) DEFAULT 'english',
    session_id INTEGER NOT NULL,
    timezone VARCHAR(100) DEFAULT 'Asia/Dhaka',
    currency VARCHAR(10) DEFAULT 'USD',
    currency_symbol VARCHAR(10) DEFAULT '$',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. Parent Management Table
-- ============================================

-- Parent Table (must come before Student)
CREATE TABLE IF NOT EXISTS parent (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(50),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    occupation VARCHAR(100),
    income VARCHAR(50),
    education VARCHAR(100),
    email VARCHAR(255),
    mobileno VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    photo VARCHAR(255),
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. Student Management Table
-- ============================================

-- Student Table
CREATE TABLE IF NOT EXISTS student (
    id SERIAL PRIMARY KEY,
    register_no VARCHAR(50) UNIQUE NOT NULL,
    admission_date DATE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    birthday DATE,
    religion VARCHAR(50),
    caste VARCHAR(50),
    blood_group VARCHAR(10),
    mother_tongue VARCHAR(50),
    current_address TEXT,
    permanent_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    mobileno VARCHAR(20),
    email VARCHAR(255),
    parent_id INTEGER NOT NULL,
    category_id INTEGER DEFAULT 0,
    route_id INTEGER DEFAULT 0,
    vehicle_id INTEGER DEFAULT 0,
    hostel_id INTEGER DEFAULT 0,
    room_id INTEGER DEFAULT 0,
    photo VARCHAR(255),
    previous_details TEXT,
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. Staff Management Table
-- ============================================

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    staff_id VARCHAR(50) UNIQUE,
    gender VARCHAR(10) NOT NULL,
    birthday DATE,
    religion VARCHAR(50),
    blood_group VARCHAR(10),
    qualification VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    photo VARCHAR(255),
    joining_date DATE,
    designation VARCHAR(100),
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. Class Management Tables
-- ============================================

-- Class Table
CREATE TABLE IF NOT EXISTS class (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_numeric VARCHAR(50),
    teacher_id INTEGER DEFAULT 0,
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Section Table
CREATE TABLE IF NOT EXISTS section (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_id INTEGER NOT NULL,
    capacity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. Academic Session Table
-- ============================================

-- Session Table
CREATE TABLE IF NOT EXISTS session (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. Student Enrollment Table
-- ============================================

-- Enroll Table
CREATE TABLE IF NOT EXISTS enroll (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    branch_id INTEGER NOT NULL,
    roll_no VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. Attendance Management Tables
-- ============================================

-- Student Attendance Table
CREATE TABLE IF NOT EXISTS student_attendance (
    id SERIAL PRIMARY KEY,
    enroll_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(2) NOT NULL, -- P=Present, A=Absent, L=Late, H=Holiday
    remark TEXT,
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff Attendance Table
CREATE TABLE IF NOT EXISTS staff_attendance (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(2) NOT NULL, -- P=Present, A=Absent, L=Late, H=Holiday
    remark TEXT,
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. Fee Management Tables
-- ============================================

-- Fee Allocation Table
CREATE TABLE IF NOT EXISTS fee_allocation (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    session_id INTEGER NOT NULL,
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fee Groups Table
CREATE TABLE IF NOT EXISTS fee_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fee Group Details Table
CREATE TABLE IF NOT EXISTS fee_groups_details (
    id SERIAL PRIMARY KEY,
    fee_groups_id INTEGER NOT NULL,
    fee_type_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fee Payment History Table
CREATE TABLE IF NOT EXISTS fee_payment_history (
    id SERIAL PRIMARY KEY,
    allocation_id INTEGER NOT NULL,
    type_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    date DATE NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 11. Accounting/Transactions Table
-- ============================================

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    dr DECIMAL(10, 2) DEFAULT 0,
    cr DECIMAL(10, 2) DEFAULT 0,
    date DATE NOT NULL,
    description TEXT,
    branch_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Add Foreign Key Constraints
-- ============================================

-- Login Log foreign keys
ALTER TABLE login_log
    ADD CONSTRAINT fk_login_log_user
    FOREIGN KEY (user_id) REFERENCES login_credential(user_id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_login_log_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- Reset Password foreign keys
ALTER TABLE reset_password
    ADD CONSTRAINT fk_reset_password_credential
    FOREIGN KEY (login_credential_id) REFERENCES login_credential(id) ON DELETE CASCADE;

-- Parent foreign keys
ALTER TABLE parent
    ADD CONSTRAINT fk_parent_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- Student foreign keys
ALTER TABLE student
    ADD CONSTRAINT fk_student_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_student_parent
    FOREIGN KEY (parent_id) REFERENCES parent(id) ON DELETE CASCADE;

-- Staff foreign keys
ALTER TABLE staff
    ADD CONSTRAINT fk_staff_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- Class foreign keys
ALTER TABLE class
    ADD CONSTRAINT fk_class_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- Section foreign keys
ALTER TABLE section
    ADD CONSTRAINT fk_section_class
    FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE;

-- Enroll foreign keys
ALTER TABLE enroll
    ADD CONSTRAINT fk_enroll_student
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_enroll_class
    FOREIGN KEY (class_id) REFERENCES class(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_enroll_section
    FOREIGN KEY (section_id) REFERENCES section(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_enroll_session
    FOREIGN KEY (session_id) REFERENCES session(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_enroll_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- Student Attendance foreign keys
ALTER TABLE student_attendance
    ADD CONSTRAINT fk_student_attendance_enroll
    FOREIGN KEY (enroll_id) REFERENCES enroll(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_student_attendance_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- Staff Attendance foreign keys
ALTER TABLE staff_attendance
    ADD CONSTRAINT fk_staff_attendance_staff
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_staff_attendance_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- Fee Allocation foreign keys
ALTER TABLE fee_allocation
    ADD CONSTRAINT fk_fee_allocation_student
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_fee_allocation_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- Fee Groups Details foreign keys
ALTER TABLE fee_groups_details
    ADD CONSTRAINT fk_fee_groups_details_group
    FOREIGN KEY (fee_groups_id) REFERENCES fee_groups(id) ON DELETE CASCADE;

-- Fee Payment History foreign keys
ALTER TABLE fee_payment_history
    ADD CONSTRAINT fk_fee_payment_allocation
    FOREIGN KEY (allocation_id) REFERENCES fee_allocation(id) ON DELETE CASCADE;

-- Transactions foreign keys
ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_branch
    FOREIGN KEY (branch_id) REFERENCES branch(id) ON DELETE CASCADE;

-- ============================================
-- Create Indexes for Better Performance
-- ============================================

-- Login Credential indexes
CREATE INDEX idx_login_credential_username ON login_credential(username);
CREATE INDEX idx_login_credential_user_id ON login_credential(user_id);
CREATE INDEX idx_login_credential_role ON login_credential(role);

-- Student indexes
CREATE INDEX idx_student_register_no ON student(register_no);
CREATE INDEX idx_student_branch_id ON student(branch_id);
CREATE INDEX idx_student_parent_id ON student(parent_id);

-- Staff indexes
CREATE INDEX idx_staff_staff_id ON staff(staff_id);
CREATE INDEX idx_staff_branch_id ON staff(branch_id);

-- Enroll indexes
CREATE INDEX idx_enroll_student_id ON enroll(student_id);
CREATE INDEX idx_enroll_class_id ON enroll(class_id);
CREATE INDEX idx_enroll_session_id ON enroll(session_id);
CREATE INDEX idx_enroll_branch_id ON enroll(branch_id);

-- Attendance indexes
CREATE INDEX idx_student_attendance_enroll_id ON student_attendance(enroll_id);
CREATE INDEX idx_student_attendance_date ON student_attendance(date);
CREATE INDEX idx_staff_attendance_staff_id ON staff_attendance(staff_id);
CREATE INDEX idx_staff_attendance_date ON staff_attendance(date);

-- Fee indexes
CREATE INDEX idx_fee_allocation_student_id ON fee_allocation(student_id);
CREATE INDEX idx_fee_payment_allocation_id ON fee_payment_history(allocation_id);

-- Transactions indexes
CREATE INDEX idx_transactions_branch_id ON transactions(branch_id);
CREATE INDEX idx_transactions_date ON transactions(date);

-- ============================================
-- Create Triggers for Updated_At
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_login_credential_updated_at BEFORE UPDATE ON login_credential
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branch_updated_at BEFORE UPDATE ON branch
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_global_settings_updated_at BEFORE UPDATE ON global_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_updated_at BEFORE UPDATE ON student
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_updated_at BEFORE UPDATE ON parent
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_updated_at BEFORE UPDATE ON class
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_section_updated_at BEFORE UPDATE ON section
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_updated_at BEFORE UPDATE ON session
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enroll_updated_at BEFORE UPDATE ON enroll
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Initial Data (Optional)
-- ============================================

-- Insert default branch (if needed)
-- INSERT INTO branch (school_name, status)
-- VALUES ('Default Campus', 1)
-- ON CONFLICT DO NOTHING;

-- Insert default session (if needed)
-- INSERT INTO session (name, start_date, end_date, active)
-- VALUES ('2024-2025', '2024-01-01', '2024-12-31', 1)
-- ON CONFLICT DO NOTHING;

-- ============================================
-- Verification Queries
-- ============================================

-- List all tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count rows in each table
-- SELECT 'login_credential' as table_name, COUNT(*) as row_count FROM login_credential
-- UNION ALL
-- SELECT 'branch', COUNT(*) FROM branch
-- UNION ALL
-- SELECT 'student', COUNT(*) FROM student;

COMMENT ON DATABASE skoolcampus IS 'SkoolCampus School Management System Database';
