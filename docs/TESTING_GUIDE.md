# 🧪 Quick Testing Guide - Department & Designation Module

## 📋 Pre-Requisites

Before testing, ensure:
```bash
# Backend is running
php artisan serve

# Frontend is running
npm run dev

# Database is migrated and seeded
php artisan migrate
php artisan db:seed
```

---

## ✅ Phase 1: Database Verification

### Check Database Tables

```sql
-- Open terminal and run:
mysql -u root -p alphagrew

-- Check tables exist
SHOW TABLES LIKE 'departments';
SHOW TABLES LIKE 'designations';
SHOW TABLES LIKE 'permissions';
SHOW TABLES LIKE 'designation_permission';

-- Check data
SELECT COUNT(*) as total_departments FROM departments;
SELECT COUNT(*) as total_designations FROM designations;
SELECT COUNT(*) as total_permissions FROM permissions;
SELECT COUNT(*) as total_assignments FROM designation_permission;
```

**Expected Results:**
- departments: 5 rows
- designations: 19 rows (4 global + 15 department-specific)
- permissions: 48 rows
- designation_permission: 50+ rows

---

## ✅ Phase 2: API Endpoint Testing

### Using Postman or cURL

#### 1. Test Department Endpoints

**Get All Departments**
```http
GET http://localhost:8000/api/v1/departments
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "Computer Science and Engineering",
      "code": "CSE",
      "hod_id": 5,
      "hod": {...},
      "intake_capacity": 120,
      "status": "active"
    }
  ]
}
```

**Get Department Statistics**
```http
GET http://localhost:8000/api/v1/departments/1/stats
Authorization: Bearer {token}
```

**Expected Response:**
```json
{
  "data": {
    "id": 1,
    "name": "Computer Science and Engineering",
    "hod_name": "Prof. Sharma",
    "staff_count": 3,
    "student_count": 120,
    "courses_count": 12,
    "status": "active"
  }
}
```

**Get HOD Options**
```http
GET http://localhost:8000/api/v1/departments/list/hod-options
Authorization: Bearer {token}
```

**Create Department**
```http
POST http://localhost:8000/api/v1/departments
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "New Department",
  "code": "NEW",
  "description": "Test department",
  "intake_capacity": 50,
  "status": "active"
}
```

#### 2. Test Designation Endpoints

**Get All Designations**
```http
GET http://localhost:8000/api/v1/designations
Authorization: Bearer {token}
```

**Expected Columns:**
- id, name, slug, department_id, description, status, permissions

**Get Designation Details**
```http
GET http://localhost:8000/api/v1/designations/1
Authorization: Bearer {token}
```

**Get Global Designations**
```http
GET http://localhost:8000/api/v1/designations/list/global
Authorization: Bearer {token}
```

**Should return:** Principal, Vice Principal, Placement Officer, Registrar

**Get Designations by Department**
```http
GET http://localhost:8000/api/v1/designations/1/by-department
Authorization: Bearer {token}
```

**Assign Permissions to Designation**
```http
POST http://localhost:8000/api/v1/designations/1/assign-permissions
Content-Type: application/json
Authorization: Bearer {token}

{
  "permission_ids": [1, 2, 3, 5, 8]
}
```

#### 3. Test Permission Endpoints

**Get All Permissions**
```http
GET http://localhost:8000/api/v1/permissions-v1
Authorization: Bearer {token}
```

**Get Permissions Grouped by Module**
```http
GET http://localhost:8000/api/v1/permissions-v1/list/grouped
Authorization: Bearer {token}
```

**Expected Modules:**
- students, staff, attendance, courses, departments, designations, marks, timetable, reports, placement

**Get Specific Module Permissions**
```http
GET http://localhost:8000/api/v1/permissions-v1/list/by-module/students
Authorization: Bearer {token}
```

---

## ✅ Phase 3: Frontend Component Testing

### Login as Admin
```
Email: admin@alphagrew.demo
Password: demo123
```

### Test DepartmentsModule

1. **Navigate to**: Admin → Departments Management

2. **Verify Display:**
   - [ ] All 5 departments visible in table
   - [ ] Search bar filters departments
   - [ ] HOD name and email display correctly
   - [ ] Staff count shows dynamically
   - [ ] Status badges show (active/inactive)

3. **Test Create Department:**
   - [ ] Click "Add Department" button
   - [ ] Fill in all fields
   - [ ] Select HOD from dropdown
   - [ ] Click "Create Department"
   - [ ] Verify new department appears in table

4. **Test Edit Department:**
   - [ ] Click edit icon on any department
   - [ ] Modify fields
   - [ ] Click "Update Department"
   - [ ] Verify changes in table

5. **Test Delete Department:**
   - [ ] Click delete icon
   - [ ] Confirm deletion
   - [ ] Verify department removed from table

### Test DesignationsModule

1. **Navigate to**: Admin → Designations Management

2. **Verify Display:**
   - [ ] All 19 designations visible
   - [ ] Global designations marked as "Global"
   - [ ] Department-specific designations show department name
   - [ ] Permission count displays correctly
   - [ ] Status badges show

3. **Test Create Designation:**
   - [ ] Click "Add Designation"
   - [ ] Enter name and slug
   - [ ] Select department or leave as global
   - [ ] Click "Create Designation"
   - [ ] Verify appears in list

4. **Test Assign Permissions:**
   - [ ] Click shield icon on any designation
   - [ ] Permission modal opens
   - [ ] Permissions grouped by module visible
   - [ ] Select various permissions
   - [ ] Click "Save Permissions"
   - [ ] Verify permission count updated

5. **Test Edit/Delete:**
   - [ ] Edit designations
   - [ ] Delete designations (with confirmation)

---

## ✅ Phase 4: Data Integrity Testing

### Verify Relationships

```sql
-- Check HOD is set correctly
SELECT d.name, u.first_name, u.last_name 
FROM departments d 
LEFT JOIN users u ON d.hod_id = u.id;

-- Check designations have correct departments
SELECT des.name, dep.name as department
FROM designations des
LEFT JOIN departments dep ON des.department_id = dep.id;

-- Check permissions assigned to designations
SELECT d.name, COUNT(p.id) as permission_count
FROM designations d
LEFT JOIN designation_permission dp ON d.id = dp.designation_id
LEFT JOIN permissions p ON dp.permission_id = p.id
GROUP BY d.id;
```

### Verify Seeded Data

**Expected Demo Users:**
```
1. admin@alphagrew.demo - Admin
2. cse.hod@alphagrew.demo - HOD (CSE)
3. ece.hod@alphagrew.demo - HOD (ECE)
4. me.hod@alphagrew.demo - HOD (ME)
5. ce.hod@alphagrew.demo - HOD (CE)
6. ee.hod@alphagrew.demo - HOD (EE)
7. dr.patel@alphagrew.demo - Faculty (CSE)
8. mr.kumar@alphagrew.demo - Faculty (CSE)
9. ms.gupta@alphagrew.demo - Faculty (ECE)
10. mr.singh@alphagrew.demo - Faculty (ME)
11. dr.verma@alphagrew.demo - Faculty (CE)
12. mrs.bhat@alphagrew.demo - Faculty (EE)
```

---

## ✅ Phase 5: Error Handling Testing

### Test Validation

```http
# Missing required fields
POST http://localhost:8000/api/v1/departments
{
  "code": "TST"
  // Missing name
}

# Expected: 422 Unprocessable Entity
# Message: "The name field is required."
```

### Test Duplicate Code
```http
POST http://localhost:8000/api/v1/departments
{
  "name": "Another CSE",
  "code": "CSE"  // Already exists
}

# Expected: 422
# Message: "The code has already been taken."
```

### Test Invalid HOD
```http
POST http://localhost:8000/api/v1/departments
{
  "name": "Test Dept",
  "code": "TST",
  "hod_id": 99999  // Non-existent user
}

# Expected: 422
# Message: "The selected hod id is invalid."
```

---

## ✅ Phase 6: Performance Testing

### Load Testing - 100 Departments

```bash
# Run seeder multiple times to create many departments
php artisan migrate:refresh
php artisan db:seed

# Then test with filtering
GET /api/v1/departments?search=CSE&per_page=50
```

**Expected:** Response time < 500ms

---

## 📊 Test Results Checklist

- [ ] All 5 departments created correctly
- [ ] All 19 designations created correctly
- [ ] All 48 permissions seeded
- [ ] Global designations work (4 total)
- [ ] Department-specific designations work (15 total)
- [ ] HOD assignment working
- [ ] Permission assignment modal working
- [ ] Search and filter working
- [ ] CRUD operations all functional
- [ ] Error messages displaying correctly
- [ ] Cascade deletes working
- [ ] Database relationships intact
- [ ] Frontend components responsive
- [ ] API pagination working
- [ ] Dynamic staff count accurate

---

## 🔧 Troubleshooting

### Issue: Permissions not showing in modal

**Solution:**
```bash
php artisan db:seed --class=PermissionsSeeder
```

### Issue: Department not showing HOD

**Solution:**
Check if HOD user exists and hod_id is correctly set:
```sql
SELECT hod_id FROM departments WHERE id = 1;
SELECT * FROM users WHERE id = (SELECT hod_id FROM departments WHERE id = 1);
```

### Issue: Designation permissions not saving

**Solution:**
Verify designation_permission table data:
```sql
SELECT * FROM designation_permission WHERE designation_id = 1;
```

### Issue: Frontend not loading designations

**Solution:**
Check browser console for errors. Verify API is returning data:
```bash
curl http://localhost:8000/api/v1/designations -H "Authorization: Bearer {token}"
```

---

## 🎯 Success Criteria

✅ All endpoints responding correctly
✅ All CRUD operations working
✅ All validations in place
✅ Frontend components loading
✅ Database data intact
✅ Relationships working
✅ Permissions assigned
✅ No console errors
✅ Demo data present
✅ Performance acceptable

**When all above are checked, implementation is COMPLETE! 🎉**
