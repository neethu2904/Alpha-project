# AlphaGrew Campus Management System - Complete Database Architecture

**Project**: AlphaGrew Campus Management System  
**Version**: 1.0 (April 2026)  
**Database**: MySQL 8.0  
**Status**: ✅ Production Ready

---

## 📑 Table of Contents

1. [Database Overview](#database-overview)
2. [Core Entity Relationships](#core-entity-relationships)
3. [Complete Table Schemas](#complete-table-schemas)
4. [Migration Timeline](#migration-timeline)
5. [Relationship Diagrams](#relationship-diagrams)
6. [Performance Considerations](#performance-considerations)
7. [Backup & Recovery](#backup--recovery)

---

## Database Overview

### Database Statistics

| Metric | Value |
|--------|-------|
| **Tables** | 22 active + spatie tables |
| **Relationships** | 50+ foreign key relationships |
| **Total Columns** | 250+ |
| **Storage Size** | ~50-100MB (with data) |
| **Indexes** | 80+ |
| **Performance** | Optimized for reads |

### Database Naming Conventions

- **Tables**: Snake case, plural (`users`, `departments`)
- **Columns**: Snake case (`hod_id`, `department_code`)
- **Foreign Keys**: `{table_singular}_id` or `{column}_id`
- **Timestamps**: `created_at`, `updated_at`, `deleted_at`
- **Soft Deletes**: `deleted_at` nullable timestamp
- **Boolean Flags**: `is_*` or `has_*` prefix

---

## Core Entity Relationships

### Relationship Diagram (ERD)

```
                            ┌─────────────────┐
                            │     USERS       │
                            │   (Laravel)     │
                            └────────┬────────┘
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ↓ 1:N              ↓ 1:1              ↓ 1:N
          ┌────────────────┐  ┌────────────────┐  ┌──────────────┐
          │   STUDENTS     │  │ DESIGNATIONS   │  │     STAFF    │
          └────────────────┘  └────────┬───────┘  └──────────────┘
                 │                     │
                 │ N:1                 ↓ N:M (pivot)
                 │              ┌─────────────────────┐
                 └──────────────→│  PERMISSIONS (NEW)  │
                                └─────────────────────┘
                     ┌────────────────┐
                     │  DEPARTMENTS   │
                     │   (UPDATED)    │
                     └────────┬───────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ↓ N:1     ↓ 1:N     ↓ 1:M
            ┌──────────────┐ ┌────────┐ ┌─────────┐
            │    COURSES   │ │  STAFF │ │STUDENTS │
            └──────┬───────┘ └────────┘ └─────────┘
                   │
                   ↓ 1:N
            ┌──────────────┐
            │   SUBJECTS   │
            └──────┬───────┘
                   │
                   ↓ 1:N
            ┌──────────────┐
            │    MARKS     │
            └──────────────┘
```

### User Role Hierarchy

```
User (Global)
├── Admin (Global access)
├── Staff
│   ├── Faculty (Teach courses)
│   ├── HOD (Head of Department)
│   ├── Placement Officer
│   ├── Exam Coordinator
│   └── Manager (Academic manager)
└── Student (Department-specific access)
```

---

## Complete Table Schemas

### 1. USERS Table (Laravel Default)

**File**: Laravel default  
**Purpose**: Authentication and user management  
**Status**: ✅ Active

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    
    -- Custom fields
    role ENUM('admin', 'staff', 'student') NOT NULL DEFAULT 'student',
    title VARCHAR(100) NULL,                           -- e.g., "Dr.", "Prof.", "Mr."
    department_code VARCHAR(50) NULL,                  -- Foreign key reference (not FK constraint)
    designation_id BIGINT UNSIGNED NULL,               -- NEW (Phase 3): FK to designations.id
    phone VARCHAR(20) NULL,
    image_url VARCHAR(255) NULL,
    communication_address TEXT NULL,
    permanent_address TEXT NULL,
    emergency_contact_person VARCHAR(255) NULL,
    emergency_contact_number VARCHAR(20) NULL,
    biometric_id VARCHAR(100) NULL,
    experience_years INT NULL,
    specialization VARCHAR(255) NULL,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL,                        -- Soft delete
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_department_code (department_code),
    INDEX idx_designation_id (designation_id),       -- NEW
    INDEX idx_deleted_at (deleted_at),
    
    -- Foreign Keys
    FOREIGN KEY (designation_id)
        REFERENCES designations(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Distinct Usage:
-- Admin: role='admin', department_code=NULL, designation_id=1 (Admin designation)
-- Faculty: role='staff', department_code='CSE', designation_id=6 (Faculty designation)
-- HOD: role='staff', department_code='CSE', designation_id=5 (HOD designation)
-- Student: role='student', department_code='CSE', designation_id=NULL

-- Records: 150-500+ in production
-- Growth: 50-100 per semester (students) + 5-10 (staff) per year
```

### 2. DEPARTMENTS Table (UPDATED Phase 3)

**File**: Phase 3 migration  
**Purpose**: Academic departments management  
**Status**: ✅ Updated (Phase 3)

```sql
CREATE TABLE departments (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,              -- Department code (CSE, ECE, etc.)
    
    -- Phase 3 Updates (NEW fields)
    hod_id BIGINT UNSIGNED NULL,                    -- Head of Department user ID
    description TEXT NULL,                          -- Long description
    email VARCHAR(255) NULL,                        -- Department contact email
    phone VARCHAR(20) NULL,                         -- Department contact phone
    intake_capacity INT UNSIGNED DEFAULT 0,        -- Student intake capacity
    status ENUM('active', 'inactive') DEFAULT 'active',
    
    -- Legacy fields (REMOVED in Phase 3)
    -- hod VARCHAR(255) - REMOVED (replaced by hod_id FK)
    -- staff_count INT - REMOVED (replaced by dynamic relationship)
    -- accent VARCHAR(10) - REMOVED
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_hod_id (hod_id),                     -- NEW
    
    -- Foreign Keys
    FOREIGN KEY (hod_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Phase 3 Migration Impact:
-- Old: hod = "Dr. John Smith" (text)
-- New: hod_id = 15 (FK to users.id with name='Dr. John Smith')
-- 
-- Old: staff_count = 12 (manual storage, gets stale)
-- New: staff_count = calculated from users where department_code='CSE' and role IN ('staff','hod')

-- Records: 5-10 per institution
-- Typical Data:
-- (1, 'Computer Science', 'CSE', 15, 'First department...', 'cse@alphagrew.edu', '+91-XXXXX', 240, 'active')
-- (2, 'Electronics', 'ECE', 16, 'Second department...', 'ece@alphagrew.edu', '+91-XXXXX', 180, 'active')
```

### 3. DESIGNATIONS Table (UPDATED Phase 3)

**File**: Phase 3 migration  
**Purpose**: Job titles/roles with permissions  
**Status**: ✅ Redesigned (Phase 3)

```sql
CREATE TABLE designations (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,              -- URL-friendly slug
    department_id BIGINT UNSIGNED NULL,             -- NEW (Phase 3)
    description TEXT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',  -- NEW
    
    -- Legacy fields (REMOVED in Phase 3)
    -- permissions JSON - REMOVED (replaced by pivot table)
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_department_id (department_id),       -- NEW
    INDEX idx_status (status),                     -- NEW
    INDEX idx_slug (slug),
    
    -- Foreign Keys
    FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Phase 3 Permission Model:
-- Global: department_id = NULL
--   Admin (id=1, dept=NULL) - System admins
--   Department HOD (id=5, dept=NULL) - HOD role for any department
-- Department-Specific: department_id = specific department ID
--   Faculty (id=6, dept=1) - Faculty in CSE only
--   Lab Assistant (id=7, dept=2) - Lab assistant in ECE only

-- Records: 10-15 per institution
-- Examples:
-- (1, 'Admin', 'admin', NULL, 'System administrator', 'active')
-- (2, 'Student', 'student', NULL, 'Default student role', 'active')
-- (5, 'HOD', 'hod', NULL, 'Head of Department', 'active')
-- (6, 'Faculty', 'faculty', 1, 'Faculty in CSE', 'active')
-- (7, 'Faculty', 'faculty', 2, 'Faculty in ECE', 'active')
```

### 4. PERMISSIONS Table (NEW - Phase 3)

**File**: Phase 3 migration  
**Purpose**: RBAC permissions management  
**Status**: ✅ New (Phase 3)

```sql
CREATE TABLE permissions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,              -- view_students, edit_courses, etc.
    module VARCHAR(100) NOT NULL,                   -- Grouping field (students, courses, etc.)
    description TEXT NOT NULL,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_module (module),                      -- Fast module-based queries
    INDEX idx_name (name)
);

-- Module Organization (50+ total permissions):
-- 1. students (7): view, create, edit, delete, view_profile, export, import
-- 2. staff (5): view, create, edit, delete, view_profile
-- 3. attendance (4): view, mark, approve, export
-- 4. courses (5): view, create, edit, delete, manage_content
-- 5. departments (5): view, create, edit, delete, manage_staff
-- 6. designations (5): view, create, edit, delete, assign_permissions
-- 7. marks (4): view, enter, approve, publish
-- 8. timetable (4): view, create, edit, delete
-- 9. reports (3): view, generate, export
-- 10. placement (4): view, manage, view_companies, manage_companies

-- Seeding Logic:
-- POST /api/v1/permissions-v1/seed/defaults
-- Creates 50+ permissions on first run

-- Records: 50+ (fixed)
-- Example:
-- (1, 'view_students', 'students', 'View all students in system')
-- (2, 'create_student', 'students', 'Create new student record')
-- (3, 'mark_attendance', 'attendance', 'Mark student attendance')
-- (12, 'view_courses', 'courses', 'View all courses')
```

### 5. DESIGNATION_PERMISSION Table (NEW - Phase 3) - PIVOT

**File**: Phase 3 migration  
**Purpose**: Many-to-many relationship between designations and permissions  
**Status**: ✅ New (Phase 3)

```sql
CREATE TABLE designation_permission (
    designation_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP,
    
    -- Primary Key (Composite)
    PRIMARY KEY (designation_id, permission_id),
    
    -- Foreign Keys with Cascade Delete
    FOREIGN KEY (designation_id)
        REFERENCES designations(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    -- Indexes for relationships
    INDEX idx_designation (designation_id),
    INDEX idx_permission (permission_id)
);

-- RBAC Flow:
-- User → Designation (user.designation_id) → Permissions (via pivot table)
-- 
-- User (John, id=15)
--   ├── designation_id = 5 (HOD)
--   └── designations table: designation 5 has permissions [1,2,3,5,12,13...]
--       └── designation_permission table: rows (5,1), (5,2), (5,3)...
--           └── permissions table: ids 1,2,3... = view_students, create_student...

-- Record Examples:
-- (1, 1) - Admin designation has view_students permission
-- (1, 2) - Admin designation has create_student permission
-- (5, 1) - HOD designation has view_students permission
-- (5, 12) - HOD designation has view_courses permission

-- Typical Counts:
-- Admin: 50+ permissions
-- HOD: 15-20 permissions
-- Faculty: 8-12 permissions
```

### 6. COURSES Table (Phase 2)

**File**: Phase 2 migration  
**Purpose**: Academic course/program management  
**Status**: ✅ Active

```sql
CREATE TABLE courses (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,                     -- MBA, B.Tech, etc.
    code VARCHAR(50) NOT NULL UNIQUE,               -- MBA001, BTECH001
    department_code VARCHAR(50) NOT NULL,           -- CSE, ECE (FK reference)
    
    -- Academic Details
    duration_years INT UNSIGNED DEFAULT 2,          -- 2 years, 4 years, etc.
    total_semesters INT UNSIGNED DEFAULT 4,         -- 4 semesters, 8 semesters
    stream VARCHAR(100) NULL,                       -- MBA, B.Tech, Diploma, etc.
    description LONGTEXT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT 1,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL,                      -- Soft delete
    
    -- Indexes
    INDEX idx_code (code),
    INDEX idx_department_code (department_code),
    INDEX idx_is_active (is_active),
    INDEX idx_deleted_at (deleted_at)
);

-- Records: 10-20 per institution
-- Typical Data:
-- (1, 'B.Tech CSE', 'BTECH-CSE', 'CSE', 4, 8, 'B.Tech', 'Bachelor of Technology in Computer Science', 1)
-- (2, 'MBA', 'MBA-GEN', 'CSE', 2, 4, 'MBA', 'Master of Business Administration', 1)

-- Relationships:
-- has_many: subjects (id → subjects.course_id)
-- has_many: marks (id → marks.course_id)
-- has_many: classes (id → classes.course_id)
```

### 7. SUBJECTS Table (Phase 2)

**File**: Phase 2 migration  
**Purpose**: Individual subject/course management  
**Status**: ✅ Active

```sql
CREATE TABLE subjects (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,                     -- Subject name
    code VARCHAR(50) NOT NULL UNIQUE,               -- Subject code
    course_id BIGINT UNSIGNED NOT NULL,             -- FK to courses
    
    -- Academic Details
    semester_number INT UNSIGNED NOT NULL,          -- 1-8 depending on course
    credit_hours INT UNSIGNED DEFAULT 3,            -- 2, 3, 4 credits
    lecture_hours INT UNSIGNED DEFAULT 3,           -- Hours per week
    practical_hours INT UNSIGNED DEFAULT 1,         -- Lab hours per week
    subject_type VARCHAR(50) DEFAULT 'lecture',     -- lecture, lab, practical
    is_mandatory BOOLEAN DEFAULT 1,                 -- Mandatory or elective
    is_active BOOLEAN DEFAULT 1,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL,                      -- Soft delete
    
    -- Indexes
    INDEX idx_course_id (course_id),
    INDEX idx_semester_number (semester_number),
    
    -- Foreign Keys
    FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Records: 200-400 per institution (depends on courses)
-- Typical Data:
-- (1, 'Data Structures', 'DSA-101', 1, 2, 3, 3, 1, 'lecture', 1, 1)
-- (2, 'Database Lab', 'DB-LAB-201', 1, 4, 0, 0, 2, 'lab', 1, 1)

-- Relationships:
-- belongs_to: courses (course_id → courses.id)
-- has_many: marks (id → marks.subject_id)
-- has_many: timetables (id → timetables.subject_id)
```

### 8. STUDENTS Table (Phase 1)

**File**: Phase 1 migration  
**Purpose**: Student records linked to users  
**Status**: ✅ Active

```sql
CREATE TABLE students (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,        -- FK to users
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    registration_number VARCHAR(50) NOT NULL UNIQUE, -- Roll number, USN, etc.
    
    -- Academic Details
    department_code VARCHAR(50) NOT NULL,           -- CSE, ECE, etc.
    year ENUM('year_1', 'year_2', 'year_3', 'year_4') DEFAULT 'year_1',
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say') DEFAULT 'prefer_not_to_say',
    
    -- Status
    status ENUM('active', 'inactive', 'placement_ready', 'placed', 'graduated') DEFAULT 'active',
    
    -- Academic Performance
    cgpa DECIMAL(3, 2) DEFAULT 0.00,                -- Current GPA (0-4)
    attendance INT DEFAULT 0,                        -- Percentage (0-100)
    
    -- Contact & Emergency
    phone VARCHAR(20) NULL,
    mentor VARCHAR(255) NULL,                        -- Mentor/advisor name
    fee_status ENUM('pending', 'partial', 'paid', 'waived') DEFAULT 'pending',
    placed_company VARCHAR(255) NULL,                -- Company name if placed
    
    -- Additional Info
    skills JSON NULL,                                -- JSON array of skills
    resume_profile JSON NULL,                        -- JSON object with resume data
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL,                      -- Soft delete
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_registration_number (registration_number),
    INDEX idx_department_code (department_code),
    INDEX idx_status (status),
    
    -- Foreign Keys
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Records: 100-500+ per institution
-- Growth: 50-150 per semester
-- Example:
-- (1, 15, 'Rajesh Kumar', 'rajesh@alphagrew.edu', 'CSE-001', 'year_1', 'male', 'active', 3.5, 85, '9876543210', 'Dr. John', 'paid', NULL, NULL, NULL)
```

### 9. STAFF Table (Phase 1)

**File**: Phase 1 migration  
**Purpose**: Staff/Faculty records linked to users  
**Status**: ✅ Active

```sql
CREATE TABLE staff (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,        -- FK to users
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NULL,
    
    department_code VARCHAR(50) NOT NULL,           -- Department assignment
    designation_id BIGINT UNSIGNED NULL,            -- Role/position
    
    -- Employment Details
    employment_type ENUM('permanent', 'contract', 'visiting') DEFAULT 'permanent',
    date_of_joining DATE NULL,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP NULL,                      -- Soft delete
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_department_code (department_code),
    INDEX idx_designation_id (designation_id),
    
    -- Foreign Keys
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (designation_id)
        REFERENCES designations(id)
        ON DELETE SET NULL
);

-- Records: 50-150 per institution
-- Example:
-- (1, 25, 'Dr. John Smith', 'john@alphagrew.edu', '+91-9876543210', 'CSE', 5, 'permanent', '2020-01-15')
```

### 10. ATTENDANCE Table (Phase 2)

**File**: Phase 2 migration  
**Purpose**: Student attendance records  
**Status**: ✅ Active

```sql
CREATE TABLE attendance (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT UNSIGNED NOT NULL,            -- FK to students
    subject_id BIGINT UNSIGNED NULL,                -- FK to subjects (optional)
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'leave', 'late') DEFAULT 'present',
    
    -- Marking Information
    marked_by BIGINT UNSIGNED NULL,                 -- Staff who marked
    approved_by BIGINT UNSIGNED NULL,               -- Staff who approved (if required)
    remarks TEXT NULL,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_student_id (student_id),
    INDEX idx_date (date),
    INDEX idx_status (status),
    
    -- Foreign Keys
    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
    FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE SET NULL,
    FOREIGN KEY (marked_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    FOREIGN KEY (approved_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Records: 1000s per semester (daily updates)
-- Example:
-- (1, 1, 1, '2026-04-13', 'present', 25, NULL, 'Regular', ...)
```

### 11. MARKS Table (Phase 2)

**File**: Phase 2 migration  
**Purpose**: Student marks/grades recording  
**Status**: ✅ Active

```sql
CREATE TABLE marks (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT UNSIGNED NOT NULL,            -- FK to students
    subject_id BIGINT UNSIGNED NOT NULL,            -- FK to subjects
    exam_type VARCHAR(100),                         -- Midterm, Final, Quiz, etc.
    
    -- Marks Details
    marks_obtained DECIMAL(5, 2) DEFAULT 0,         -- Actual marks (0-100)
    total_marks INT DEFAULT 100,                    -- Total possible marks
    percentage DECIMAL(5, 2) GENERATED ALWAYS AS (marks_obtained * 100 / total_marks),
    grade VARCHAR(5),                               -- A, B, C, D, F
    
    -- Meta Info
    entered_by BIGINT UNSIGNED NULL,                -- Staff who entered marks
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_student_id (student_id),
    INDEX idx_subject_id (subject_id),
    
    -- Foreign Keys
    FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
    FOREIGN KEY (subject_id)
        REFERENCES subjects(id)
        ON DELETE CASCADE,
    FOREIGN KEY (entered_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Records: 5000+ per semester (multi-exam subjects)
-- Example:
-- (1, 1, 1, 'Midterm', 45, 50, 90.00, 'A', 25, ...)
```

### 12. COMPANIES Table (Phase 1)

**File**: Phase 1 migration  
**Purpose**: Placement/Recruitment company records  
**Status**: ✅ Active

```sql
CREATE TABLE companies (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100),                              -- Job position
    package_offered DECIMAL(8, 2),                  -- Salary/LPA
    drive_date DATE NULL,                           -- Drive scheduled date
    
    -- Status & Type
    status ENUM('upcoming', 'open', 'closing_soon', 'closed') DEFAULT 'upcoming',
    type ENUM('placement', 'internship') DEFAULT 'placement',
    
    -- Details
    location VARCHAR(255),
    applicants INT DEFAULT 0,                       -- Number of applicants
    shortlisted INT DEFAULT 0,                      -- Number shortlisted
    eligible_departments JSON NULL,                 -- JSON array of department codes
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_name (name),
    INDEX idx_status (status),
    INDEX idx_drive_date (drive_date)
);

-- Records: 20-50 per placement season
-- Example:
-- (1, 'Google', 'Software Engineer', 25.00, '2026-05-15', 'open', 'placement', 'Bangalore', 150, 30, JSON_ARRAY('CSE','ECE'))
```

### 13. ANNOUNCEMENTS Table (Phase 1)

**File**: Phase 1 migration  
**Purpose**: System announcements and notifications  
**Status**: ✅ Active

```sql
CREATE TABLE announcements (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500),
    content LONGTEXT,
    category VARCHAR(100),                          -- students, staff, general, etc.
    
    -- Audience & Priority
    audience ENUM('all', 'students', 'staff', 'admin', 'department') DEFAULT 'all',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    
    -- Metadata
    posted_by BIGINT UNSIGNED NULL,                 -- Staff who posted
    date DATE NOT NULL,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_category (category),
    INDEX idx_audience (audience),
    INDEX idx_date (date),
    
    -- Foreign Keys
    FOREIGN KEY (posted_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Records: 100-300 per year
-- Example:
-- (1, 'Exam Schedule Released', 'Final exam schedule is now available...', '..full content..', 'announcement', 'students', 'high', 25, '2026-04-13')
```

### 14. ACTIVITY_LOG Table (Custom Trait)

**File**: Custom trait implementation  
**Purpose**: Audit trail and activity tracking  
**Status**: ✅ Active

```sql
CREATE TABLE activity_log (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,               -- Who performed action
    action VARCHAR(100) NOT NULL,                   -- created, updated, deleted
    module VARCHAR(100),                            -- students, courses, etc.
    
    -- Model Information
    model_type VARCHAR(255),                        -- Class name (App\Models\Student)
    model_id BIGINT UNSIGNED,                       -- Record ID that was modified
    
    -- Change Information
    old_values JSON NULL,                           -- Before state
    new_values JSON NULL,                           -- After state
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_model_type (model_type),
    INDEX idx_created_at (created_at),
    
    -- Foreign Keys
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Records: 1000s (depends on activity)
-- Example:
-- (1, 25, 'created', 'students', 'App\Models\Student', 1, NULL, JSON_OBJECT('name', 'Rajesh', 'email', 'rajesh@..'), '2026-04-13')
```

### 15. MASTER_OPTIONS Table (Phase 1)

**File**: Phase 1 migration (custom)  
**Purpose**: System-wide configuration options  
**Status**: ✅ Active

```sql
CREATE TABLE master_options (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100) NOT NULL,                 -- academic_year, student_year, etc.
    code VARCHAR(50) NOT NULL,                      -- Unique code
    label VARCHAR(255) NOT NULL,                    -- Display label
    description TEXT NULL,
    sort_order INT DEFAULT 1,                       -- Display order
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_category (category),
    INDEX idx_code (code),
    INDEX idx_sort_order (sort_order)
);

-- Records: 50-100 (configuration data)
-- Example:
-- (1, 'student_year', 'year_1', 'First Year', 'First year students', 10)
-- (2, 'student_year', 'year_2', 'Second Year', 'Second year students', 20)
```

### 16. SPATIE PERMISSION TABLES

**File**: Spatie Permission package  
**Purpose**: Alternative RBAC system (integrated with new system)  
**Status**: ✅ Active

```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'sanctum',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE permissions (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'sanctum',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE role_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (permission_id, role_id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE model_has_roles (
    role_id BIGINT UNSIGNED NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    PRIMARY KEY (role_id, model_id, model_type),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE model_has_permissions (
    permission_id BIGINT UNSIGNED NOT NULL,
    model_id BIGINT UNSIGNED NOT NULL,
    model_type VARCHAR(255) NOT NULL,
    PRIMARY KEY (permission_id, model_id, model_type),
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

**Note**: New system uses `designations` + `permissions` + `designation_permission` tables instead of Spatie roles for better flexibility.

---

## Migration Timeline

### Phase 1 Migrations (Initial)
- 0001: Create users, students, staff tables
- 0002: Create companies, announcements tables
- 0003: Create master_options table
- 0004: Spatie Permission tables
- 0005: Create attendance table

### Phase 2 Migrations (Academic)
- 2026_04_13_000001: Create courses, subjects, academic_years, semesters
- 2026_04_13_000002: Add marks table

### Phase 3 Migrations (RBAC) ✅ COMPLETE
- **2026_04_13_000003**: Update departments table (230ms)
  - Drops: hod (text), staff_count, accent
  - Adds: hod_id (FK), description, email, phone, intake_capacity, status
  - Check: Drops only if columns exist
  
- **2026_04_13_000004**: Update designations table (128ms)
  - Adds: department_id (nullable FK), status (enum)
  - Drops: permissions (JSON)
  - Cascade delete on department
  
- **2026_04_13_000005**: Create permissions table (3ms)
  - New table with id, name, module, description
  - Index on module field
  
- **2026_04_13_000006**: Create designation_permission pivot (181ms)
  - Pivot table: designation_id, permission_id, created_at
  - Cascade deletes on both sides
  - Unique constraint on (designation_id, permission_id)

**Total Phase 3 Time**: 542ms ✅ Success

### Future Migrations (Phase 4+)
- Timetable system
- Advanced reporting
- Performance optimizations

---

## Relationship Diagrams

### 1. User & Authorization Flow

```
User (1)
   ├── designation_id → Designation (1)
   │   └── permissions (N) via designation_permission pivot
   │       └── Each Permission has module + name
   │
   └── role → (admin, staff, student)
       └── Determines access level + available features
```

### 2. Department Structure

```
Department (1)
   ├── hod_id → User (HOD)
   │   └── User.name, User.email, User.phone
   │
   ├── staff (N) → Users with department_code matching
   │   ├── Designation
   │   └── Permissions
   │
   ├── students (N) → Students with department_code matching
   │   └── User relationship
   │
   ├── courses (N) → Courses with department_code matching
   │   └── Subjects (N)
   │       └── Marks (N)
   │
   └── designations (N, dept-specific)
       └── Permissions
```

### 3. Academic Structure

```
Course (1)
   ├── department_code
   │
   ├── subjects (N)
   │   ├── semester_number
   │   ├── credit_hours
   │   └── marks (N)
   │       └── student_id
   │
   └── classes (N) - Related if that table existed
```

### 4. Permission Grant Flow

```
User (Rajesh)
   ├── user.designation_id = 6 (Faculty)
   │
   └── Designation (6, Faculty, dept_id=1)
       ├── designation_permission rows: (6,1), (6,5), (6,12), (6,13)...
       │
       └── Permissions:
           ├── 1 →  view_students
           ├── 5 →  view_courses
           ├── 12 → mark_attendance
           ├── 13 → view_marks
           └── ... (8-12 total for Faculty)
```

---

## Performance Considerations

### Query Optimization

**1. Indexes on Foreign Keys**
```sql
-- Fast joins and lookups
INDEX idx_user_id (user_id)
INDEX idx_student_id (student_id)
INDEX idx_designation_id (designation_id)
```

**2. Indexed Search Fields**
```sql
-- Fast filtering
INDEX idx_email (email)
INDEX idx_status (status)
INDEX idx_department_code (department_code)
```

**3. Cascade Delete Performance**
```
-- When department deleted:
-- 1. All designations with that department_id deleted
-- 2. All designation_permission records deleted (cascade)
-- Time: O(n) where n = permission count
```

### N+1 Query Prevention

**Problem**: Loading 100 designations + 100 permission queries

**Solution**: Eager load relationships
```php
// GOOD
$designations = Designation::with('permissions')->get();

// BAD (N+1)
$designations = Designation::all();
foreach ($designations as $d) {
    $d->permissions; // Query per designation
}
```

### Caching Strategy

**Recommended Caching**:
- Permissions cache (rarely change) - 1 hour
- Department list (occasionally change) - 15 minutes
- User permissions (change on role update) - 30 minutes
- Master options (fixed) - 24 hours

---

## Backup & Recovery

### Backup Strategy

```bash
# Daily backup
mysqldump -u root -p alphagrew > backup_$(date +%Y%m%d).sql

# Backup critical tables only
mysqldump -u root -p alphagrew users departments designations permissions > critical_$(date +%Y%m%d).sql
```

### Recovery Procedures

**1. Restore Full Database**
```bash
mysql -u root -p alphagrew < backup_20260413.sql
```

**2. Restore Specific Table**
```bash
mysql -u root -p alphagrew < backup_20260413.sql
# OR selective restoration
```

**3. Point-in-Time Recovery**
```bash
# Using binary logs (if enabled)
mysqlbinlog -start-datetime="2026-04-13 10:00:00" /var/log/mysql/binary-log.000001 | mysql -u root -p
```

### Disaster Recovery Plan

1. **Daily Backups** → Automated at 2 AM
2. **Weekly Full Backups** → Monday midnight
3. **Monthly Snapshots** → 1st of month
4. **Off-site Storage** → Copy weekly backups to cloud
5. **Recovery Testing** → Quarterly restoration test

---

## Database Maintenance

### Regular Maintenance Tasks

```sql
-- Optimize all tables (Weekly)
OPTIMIZE TABLE users, departments, designations, courses, subjects, students, marks, attendance;

-- Check integrity (Monthly)
CHECK TABLE users, departments, courses;

-- Repair if needed (As required)
REPAIR TABLE users;

-- Analyze statistics (Weekly)
ANALYZE TABLE departments, designations, permissions;
```

### Performance Monitoring

```sql
-- Slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;

-- Index usage
SELECT * FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE OBJECT_SCHEMA = 'alphagrew' AND COUNT_READ > 0
ORDER BY COUNT_READ DESC;

-- Table sizes
SELECT table_name, (data_length + index_length) / 1024 / 1024 AS size_mb
FROM information_schema.tables
WHERE table_schema = 'alphagrew'
ORDER BY size_mb DESC;
```

---

**Last Updated**: April 13, 2026  
**Database Version**: 1.0  
**Status**: ✅ Production Ready
