# Department Fields - COMPLETE ✅

**Status**: All department fields implemented and verified  
**Date**: April 13, 2026  
**Database**: MySQL/SQLite with Spatie permissions integration

---

## 📋 Department Fields Specification

### 🧾 Basic Info
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | BigInt (PK) | ✓ | Primary key, auto-increment |
| `name` | String(255) | ✓ | Department name (e.g., "Computer Science & Engineering") |
| `code` | String(255), UNIQUE | ✓ | Department code (e.g., "CSE", "ME", "ECE") |
| `description` | Text | Optional | Department description/overview |

### 👨‍🏫 Management
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hod_id` | BigInt (FK) | Optional | Head of Department → references `users.id` |
| `contact_email` | String(255) | Optional | Department contact email address |
| `phone` | String(20) | Optional | Department contact phone number |

### 📊 Capacity
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `intake_capacity` | Integer | Optional (default 0) | Total student intake capacity per year |

### 🔄 Status & Control
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | Enum (active\|inactive) | ✓ (default: active) | Department status |
| `created_at` | Timestamp | ✓ | Record creation timestamp |
| `updated_at` | Timestamp | ✓ | Last update timestamp |

---

## 🗄️ Database Schema

### Table: `departments`

```sql
CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL UNIQUE,
    description LONGTEXT,
    hod_id BIGINT UNSIGNED NULLABLE,
    contact_email VARCHAR(255) NULLABLE,
    phone VARCHAR(20) NULLABLE,
    intake_capacity INT UNSIGNED DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hod_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_code ON departments(code);
CREATE INDEX idx_status ON departments(status);
```

---

## 💻 Model Definition

### App\Models\Department

**File**: `backend/app/Models/Department.php`

```php
class Department extends Model
{
    protected $fillable = [
        'name',              // 🧾 Basic Info
        'code',              // 🧾 Basic Info
        'description',       // 🧾 Basic Info
        'hod_id',            // 👨‍🏫 Management
        'contact_email',     // 👨‍🏫 Management
        'phone',             // 👨‍🏫 Management
        'intake_capacity',   // 📊 Capacity
        'status',            // 🔄 Status & Control
    ];

    // Relationships
    public function hod(): BelongsTo { ... }           // HOD staff member
    public function students(): HasMany { ... }       // All students
    public function staff(): HasMany { ... }          // All staff members
    public function courses(): HasMany { ... }        // All courses
    
    // Scopes (Queries)
    public function scopeActive($query) { ... }       // Active only
    public function scopeInactive($query) { ... }     // Inactive only
    
    // Attributes
    public function getStaffCountAttribute(): int { ... }  // Dynamic count
}
```

---

## 📝 Usage Examples

### Create Department

```php
$department = Department::create([
    'name' => 'Computer Science & Engineering',
    'code' => 'CSE',
    'description' => 'Department dedicated to computer science and engineering disciplines',
    'hod_id' => $staffMember->id,
    'contact_email' => 'cse@campus.edu',
    'phone' => '+1-555-0100',
    'intake_capacity' => 120,
    'status' => 'active',
]);
```

### Query Departments

```php
// All active departments
$active = Department::active()->get();

// Department with HOD details
$dept = Department::with('hod')->where('code', 'CSE')->first();

// Get staff count
$staffCount = $dept->staff_count;  // Dynamic property

// Get all students
$students = $dept->students()->get();

// Get all courses
$courses = $dept->courses()->get();
```

### Update Department

```php
$department->update([
    'contact_email' => 'newemail@campus.edu',
    'hod_id' => $newHOD->id,
    'status' => 'inactive',
]);
```

### Scope Queries

```php
// Active departments only
Department::active()->paginate(10);

// Inactive departments
Department::inactive()->get();

// By status
Department::where('status', 'active')->count();

// By code
Department::whereCode('CSE')->first();
```

---

## 🔗 Relationships

### Department ↔ User (HOD)
```
Department.hod_id → User.id
One-to-Many relationship (soft)
```
**Example:**
```php
$department->hod;  // Get HOD staff member
$department->hod->name;  // Get HOD name
```

### Department ↔ Student
```
Department.code ← Student.department_code
One-to-Many relationship
```
**Example:**
```php
$department->students;  // Get all students
$department->students()->count();  // Count students
```

### Department ↔ Staff
```
Department.code ← User.department_code (where role in ['staff', 'hod'])
One-to-Many relationship
```
**Example:**
```php
$department->staff;  // Get all staff members
$department->staff->count();  // Get staff count (dynamic)
```

### Department ↔ Course
```
Department.id ← Course.department_id
One-to-Many relationship
```
**Example:**
```php
$department->courses;  // Get all courses
```

---

## ✅ Validation Rules

### Department Validation Schema

```php
$rules = [
    'name' => 'required|string|max:255|unique:departments,name,' . $departmentId,
    'code' => 'required|string|max:255|unique:departments,code,' . $departmentId,
    'description' => 'nullable|string|max:2000',
    'hod_id' => 'nullable|integer|exists:users,id',
    'contact_email' => 'nullable|email|max:255',
    'phone' => 'nullable|string|max:20|regex:/^[0-9+\-\s()]+$/',
    'intake_capacity' => 'nullable|integer|min:0|max:999',
    'status' => 'required|in:active,inactive',
];
```

---

## 🔐 Permissions Integration

### Department-Related Permissions

From `CampusPermission` constants:

```php
// View permissions
DEPARTMENTS_VIEW        // Can view department list/details
STAFF_VIEW              // Can view staff assigned to department

// Management permissions
DEPARTMENTS_CREATE      // Can create new department
DEPARTMENTS_EDIT        // Can edit department
DEPARTMENTS_DELETE      // Can delete department

// Staff management
STAFF_CREATE           // Can assign staff to department
STAFF_EDIT             // Can change HOD assignments
```

### Route Protection

```php
// Public view
GET /api/v1/departments
    ->middleware('permission:departments.view,sanctum');

// Create department
POST /api/v1/departments
    ->middleware('permission:departments.create,sanctum');

// Update department
PUT /api/v1/departments/{department}
    ->middleware('permission:departments.edit,sanctum');

// Delete department
DELETE /api/v1/departments/{department}
    ->middleware('permission:departments.delete,sanctum');
```

---

## 📊 Common Queries

### Get Department Statistics

```php
$dept = Department::with(['students', 'staff', 'courses'])
    ->where('id', $departmentId)
    ->first();

$stats = [
    'name' => $dept->name,
    'code' => $dept->code,
    'hod' => $dept->hod?->name,
    'staff_count' => $dept->staff_count,
    'student_count' => $dept->students->count(),
    'course_count' => $dept->courses->count(),
    'intake_capacity' => $dept->intake_capacity,
    'status' => $dept->status,
];
```

### Find Department by Any Identifier

```php
// By ID
Department::find(1);

// By code
Department::where('code', 'CSE')->first();

// By name
Department::where('name', 'Computer Science & Engineering')->first();

// Active department
Department::where('code', 'CSE')->active()->first();
```

### Update HOD

```php
$department->update([
    'hod_id' => $newStaffMember->id,
]);

// Or use sync-like operation
$department->hod()->associate($newStaffMember)->save();
```

---

## 🔄 Status Lifecycle

### Department Status Flow

```
┌─────────────────────────────────────────┐
│                                         │
│  Inactive (new)  ──→  Active  ──→  Inactive (archived)
│                                         │
└─────────────────────────────────────────┘
```

**Transitions:**
- **Active**: Department is operational, accepting students, running courses
- **Inactive**: Department is not accepting new students, archived records only

---

## 🧪 Testing Validation

### Department Creation Test

```php
$department = Department::factory()->create([
    'name' => 'Software Engineering',
    'code' => 'SE',
    'hod_id' => User::factory()->create(['role' => 'staff'])->id,
    'status' => 'active',
]);

$this->assertDatabaseHas('departments', [
    'code' => 'SE',
    'status' => 'active',
]);
```

---

## 📋 Migration File

**File**: `database/migrations/2026_04_13_complete_department_fields.php`

**Status**: ✅ Complete  
**Adds**:
- description (text)
- hod_id (unsigned big integer, foreign key)
- contact_email (string)
- phone (string)
- intake_capacity (unsigned integer)
- status (enum: active/inactive)

**Removes** (if duplicate):
- Old 'hod' string field
- Old 'intake' field (replaced by 'intake_capacity')

---

## ✨ Implementation Complete

All department fields are now fully implemented according to specification:

✅ **Basic Info**: name, code, description  
✅ **Management**: hod_id (foreign key), contact_email, phone  
✅ **Capacity**: intake_capacity  
✅ **Status & Control**: status, created_at, updated_at  

**Ready for**: Production deployments, API endpoints, Admin interfaces

---

**Last Updated**: April 13, 2026  
**Status**: ✅ COMPLETE & VERIFIED
