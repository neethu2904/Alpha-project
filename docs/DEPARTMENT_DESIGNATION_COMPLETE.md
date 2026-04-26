# Department & Designation Module - Complete Documentation

## Overview
This document outlines the complete structure of the Department and Designation modules with Role-Based Access Control (RBAC) system.

---

## 1️⃣ DEPARTMENT MODULE

### 🧾 Complete Department Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | BigInteger | Auto | Primary key |
| `name` | String(255) | ✓ | Department name (e.g., "Computer Science and Engineering") |
| `code` | String(50) | ✓ | Unique department code (e.g., "CSE", "ECE", "ME") |
| `description` | Text | Optional | Department description and details |
| `hod_id` | BigInteger | Optional | Head of Department (FK: users.id) |
| `email` | String(255) | Optional | Department contact email |
| `phone` | String(20) | Optional | Department contact phone |
| `intake_capacity` | Integer | Optional | Maximum students per academic year |
| `status` | Enum | Default: 'active' | Active \| Inactive |
| `created_at` | Timestamp | Auto | Creation timestamp |
| `updated_at` | Timestamp | Auto | Last update timestamp |

### 📊 Department Relationships

```
Department
├── hod() → BelongsTo User (Head of Department)
├── students() → HasMany Student (via department_code)
├── staff() → HasMany User (via department_code, role: staff/hod)
└── courses() → HasMany Course
```

### 📈 Dynamic Calculations

- **Staff Count**: Calculated dynamically from Users table
  ```php
  $department->staff()->count()
  ```

- **Student Count**: Calculated dynamically from Students table
  ```php
  $department->students()->count()
  ```

- **Courses Count**: Calculated from Courses table
  ```php
  $department->courses()->count()
  ```

### 🔌 Department API Endpoints

```
GET    /api/v1/departments
POST   /api/v1/departments
GET    /api/v1/departments/{department}
PUT    /api/v1/departments/{department}
DELETE /api/v1/departments/{department}
GET    /api/v1/departments/{department}/stats
GET    /api/v1/departments/list/hod-options
```

### 📝 Department Request/Response Examples

**Create Department:**
```json
{
  "name": "Computer Science and Engineering",
  "code": "CSE",
  "description": "Department of Computer Science and Engineering",
  "hod_id": 5,
  "email": "cse@alphagrew.edu",
  "phone": "+91-9876543210",
  "intake_capacity": 120,
  "status": "active"
}
```

**Department Response:**
```json
{
  "id": 1,
  "name": "Computer Science and Engineering",
  "code": "CSE",
  "description": "Department of Computer Science and Engineering",
  "hod_id": 5,
  "hod": {
    "id": 5,
    "first_name": "Prof.",
    "last_name": "Sharma",
    "email": "cse.hod@alphagrew.edu"
  },
  "email": "cse@alphagrew.edu",
  "phone": "+91-9876543210",
  "intake_capacity": 120,
  "status": "active",
  "staff_count": 8,
  "student_count": 120,
  "courses_count": 12,
  "created_at": "2026-04-13T10:00:00Z",
  "updated_at": "2026-04-13T10:00:00Z"
}
```

---

## 2️⃣ DESIGNATION MODULE

### 🧾 Complete Designation Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | BigInteger | Auto | Primary key |
| `name` | String(255) | ✓ | Designation name (e.g., "HOD", "Faculty", "Clerk") |
| `slug` | String(255) | ✓ | URL-friendly identifier (auto-generated or custom) |
| `department_id` | BigInteger | Optional | Department FK (null = global designation) |
| `description` | Text | Optional | Designation description |
| `status` | Enum | Default: 'active' | Active \| Inactive |
| `created_at` | Timestamp | Auto | Creation timestamp |
| `updated_at` | Timestamp | Auto | Last update timestamp |

### 📊 Designation Relationships

```
Designation
├── department() → BelongsTo Department
├── users() → HasMany User
└── permissions() → BelongsToMany Permission (via designation_permission)
```

### 🧠 Designation Types

#### Global Designations (department_id = null)
- Principal
- Vice Principal
- Placement Officer
- Registrar
- Admin

#### Department-Specific Designations
- Head of Department (HOD) - per department
- Faculty / Professor - per department
- Clerk - per department
- Lab Assistant - per department (optional)

### 🔌 Designation API Endpoints

```
GET    /api/v1/designations
POST   /api/v1/designations
GET    /api/v1/designations/{designation}
PUT    /api/v1/designations/{designation}
DELETE /api/v1/designations/{designation}
GET    /api/v1/designations/list/departments
GET    /api/v1/designations/list/permissions
GET    /api/v1/designations/list/global
GET    /api/v1/designations/{department}/by-department
POST   /api/v1/designations/{designation}/assign-permissions
```

### 📝 Designation Request/Response Examples

**Create Designation:**
```json
{
  "name": "Head of Department",
  "slug": "hod-cse",
  "department_id": 1,
  "description": "Head managing the department",
  "status": "active",
  "permissions": [2, 5, 8, 12]
}
```

**Designation Response:**
```json
{
  "id": 1,
  "name": "Head of Department",
  "slug": "hod-cse",
  "department_id": 1,
  "department": {
    "id": 1,
    "name": "Computer Science and Engineering"
  },
  "description": "Head managing the department",
  "status": "active",
  "permissions": [
    {
      "id": 2,
      "name": "view_students",
      "module": "students",
      "description": "View all students"
    },
    {
      "id": 5,
      "name": "create_student",
      "module": "students",
      "description": "Create new student"
    }
  ],
  "permission_count": 4,
  "created_at": "2026-04-13T10:00:00Z",
  "updated_at": "2026-04-13T10:00:00Z"
}
```

---

## 3️⃣ PERMISSIONS MODULE (RBAC)

### 🧾 Complete Permission Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | BigInteger | Auto | Primary key |
| `name` | String(255) | ✓ | Permission name (e.g., "view_students", "create_student") |
| `module` | String(100) | ✓ | Module category (students, staff, courses, etc.) |
| `description` | Text | Optional | Permission description |
| `created_at` | Timestamp | Auto | Creation timestamp |
| `updated_at` | Timestamp | Auto | Last update timestamp |

### 📦 Available Modules & Permissions

#### Students Module
- `view_students` - View all students
- `create_student` - Create new student
- `edit_student` - Edit student information
- `delete_student` - Delete student records
- `view_student_profile` - View student profile details
- `export_students` - Export student data

#### Staff Module
- `view_staff` - View all staff members
- `create_staff` - Create new staff member
- `edit_staff` - Edit staff information
- `delete_staff` - Delete staff records
- `view_staff_profile` - View staff profile details

#### Attendance Module
- `view_attendance` - View attendance records
- `mark_attendance` - Mark student attendance
- `approve_attendance` - Approve attendance submissions
- `export_attendance` - Export attendance reports

#### Courses Module
- `view_courses` - View all courses
- `create_course` - Create new course
- `edit_course` - Edit course information
- `delete_course` - Delete course
- `manage_course_content` - Manage course subjects and structure

#### Departments Module
- `view_departments` - View all departments
- `create_department` - Create new department
- `edit_department` - Edit department information
- `delete_department` - Delete department
- `manage_department_staff` - Manage department staff assignments

#### Designations Module
- `view_designations` - View all designations
- `create_designation` - Create new designation
- `edit_designation` - Edit designation
- `delete_designation` - Delete designation
- `assign_permissions` - Assign permissions to designations

#### Marks Module
- `view_marks` - View marks/grades
- `enter_marks` - Enter student marks
- `approve_marks` - Approve marks submission
- `publish_marks` - Publish marks to students

#### Timetable Module
- `view_timetable` - View timetable
- `create_timetable` - Create timetable
- `edit_timetable` - Edit timetable
- `delete_timetable` - Delete timetable

#### Reports Module
- `view_reports` - View system reports
- `generate_reports` - Generate custom reports
- `export_reports` - Export report data

#### Placement Module
- `view_placements` - View placement records
- `manage_placements` - Manage placement activities
- `view_companies` - View registered companies
- `manage_companies` - Manage company registrations

### 🔌 Permission API Endpoints

```
GET    /api/v1/permissions-v1
POST   /api/v1/permissions-v1
GET    /api/v1/permissions-v1/{permission}
PUT    /api/v1/permissions-v1/{permission}
DELETE /api/v1/permissions-v1/{permission}
GET    /api/v1/permissions-v1/list/modules
GET    /api/v1/permissions-v1/list/by-module/{module}
GET    /api/v1/permissions-v1/list/grouped
POST   /api/v1/permissions-v1/seed/defaults
```

---

## 4️⃣ JUNCTION TABLES

### designation_permission Table

Creates a many-to-many relationship between Designations and Permissions.

| Field | Type | Foreign Key |
|-------|------|-------------|
| `id` | BigInteger | - |
| `designation_id` | BigInteger | designations.id |
| `permission_id` | BigInteger | permissions.id |
| `timestamps` | - | - |

**Unique Constraint**: (designation_id, permission_id)

---

## 5️⃣ DATABASE STRUCTURE DIAGRAM

```
┌─────────────────────┐
│   Departments       │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ code (UNIQUE)       │
│ description         │
│ hod_id (FK→users)   │
│ email               │
│ phone               │
│ intake_capacity     │
│ status              │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        │
        │ hod_id
        ▼
┌─────────────────────┐
│    Users            │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email               │
│ department_code (FK)│
│ designation_id (FK) │
│ ...                 │
└─────────────────────┘
        │
        │ designation_id
        ▼
┌─────────────────────────┐      ┌──────────────────────┐
│   Designations          │      │   Permissions       │
├─────────────────────────┤      ├──────────────────────┤
│ id (PK)                 │      │ id (PK)              │
│ name                    │◄────►│ name                 │
│ slug (UNIQUE)           │      │ module               │
│ department_id (FK)      │      │ description          │
│ description             │      │ created_at           │
│ status                  │      │ updated_at           │
│ created_at              │      └──────────────────────┘
│ updated_at              │    (via designation_permission)
└─────────────────────────┘
        ▲
        │
        │ department_id
        │ (nullable)
        │
    ┌───┴────────────┐
    │   Departments  │
    └────────────────┘
```

---

## 🎯 EXAMPLE ROLE HIERARCHIES

### CSE Department

**HOD (Head of Department)**
- Permissions:
  - view_students, view_staff, create_staff, edit_staff
  - view_courses, create_course, edit_course
  - view_marks, enter_marks
  - view_timetable, create_timetable
  - manage_department_staff

**Faculty/Professor**
- Permissions:
  - view_students, view_student_profile
  - mark_attendance
  - enter_marks
  - view_timetable
  - export_attendance

**Department Clerk**
- Permissions:
  - view_students, create_student, edit_student, export_students
  - view_staff, create_staff, edit_staff

---

## 🚀 IMPLEMENTATION STEPS

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Run Seeders
```bash
php artisan db:seed
```

This will:
1. Create all Permissions (modules & permissions)
2. Create all Departments
3. Create all Designations (both global and department-specific)
4. Assign permissions to designations
5. Create demo staff users

### 3. Access via Frontend

The frontend components handle:
- **DepartmentsModule.tsx**: Department CRUD with HOD assignment
- **DesignationsModule.tsx**: Designation CRUD with permission assignment

---

## 📋 MIGRATION FILES

All migrations are idempotent (can be run multiple times):

1. `2026_04_06_082622_create_departments_table.php` - Initial table
2. `2026_04_13_000003_update_departments_table_structure.php` - Update fields
3. `2026_04_09_090000_create_designations_table.php` - Initial table
4. `2026_04_13_000004_update_designations_table_structure.php` - Update fields
5. `2026_04_13_000005_create_permissions_table.php` - Permissions table
6. `2026_04_13_000006_create_designation_permission_table.php` - Junction table

---

## 🔐 Security Considerations

1. **HOD Constraint**: Can only be a staff member or existing HOD user
2. **Permission Sync**: Always use `sync()` to replace permissions (prevents duplicates)
3. **Status Check**: Only active designations can be assigned
4. **Unique Slugs**: Slugs are unique to prevent conflicts
5. **Cascade Delete**: Deleting a designation cascades to its permissions

---

## ✅ VERIFICATION CHECKLIST

- [ ] All migrations executed successfully
- [ ] PermissionsSeeder populated permissions table
- [ ] DepartmentsAndDesignationsSeeder created departments
- [ ] All designations created with correct permissions
- [ ] Demo users created with correct departments/designations
- [ ] Frontend components load without errors
- [ ] Department CRUD operations working
- [ ] Designation CRUD operations working
- [ ] Permission assignment to designations working
- [ ] HOD selection dropdown populating correctly

---

## 📞 Support

For issues or clarifications:
1. Check migrations in `database/migrations/`
2. Review seeders in `database/seeders/`
3. Check models in `app/Models/`
4. Verify API routes in `routes/api.php`
5. Review frontend components in `frontend/src/components/admin/`
