# PostgreSQL Database Setup - Complete ✅

All SQL scripts and configuration files have been created for the SkoolCampus backend with PostgreSQL.

## What Was Created

### 1. Database Schema Script
📁 **Location:** `nestjs-backend/database/01_create_tables.sql`

**Contains:**
- ✅ 19 table definitions (all migrated from MySQL to PostgreSQL)
- ✅ All foreign key constraints
- ✅ Indexes for performance optimization
- ✅ Triggers for auto-updating `updated_at` columns
- ✅ Comments and documentation

**Tables Created:**
1. Authentication: `login_credential`, `login_log`, `reset_password`
2. Configuration: `branch`, `global_settings`
3. Users: `student`, `parent`, `staff`
4. Academic: `class`, `section`, `session`, `enroll`
5. Attendance: `student_attendance`, `staff_attendance`
6. Finance: `fee_allocation`, `fee_groups`, `fee_groups_details`, `fee_payment_history`
7. Accounting: `transactions`

### 2. Updated Prisma Schema
📁 **Location:** `nestjs-backend/prisma/schema.prisma`

**Changes:**
- ✅ Changed provider from `mysql` to `postgresql`
- ✅ Updated all data types:
  - `@db.TinyInt` → `@db.SmallInt`
  - `@db.DateTime` → `@db.Timestamp`
  - All other types compatible with PostgreSQL

### 3. Environment Configuration
📁 **Location:** `nestjs-backend/.env`

**Updated:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skoolcampus?schema=public"
```

### 4. Setup Scripts

#### Windows Script
📁 **Location:** `nestjs-backend/database/setup-database.bat`
- Automated database setup for Windows
- Checks PostgreSQL installation
- Executes SQL script
- Shows success/error messages

#### Linux/Mac Script
📁 **Location:** `nestjs-backend/database/setup-database.sh`
- Automated database setup for Unix systems
- Same functionality as Windows version

### 5. Documentation

#### Quick Reference Guide
📁 **Location:** `nestjs-backend/database/README.md`
- Quick setup instructions
- Database overview
- Troubleshooting tips

#### Detailed Setup Guide
📁 **Location:** `nestjs-backend/database/SETUP_INSTRUCTIONS.md`
- Complete step-by-step instructions
- Multiple setup methods
- Verification steps
- Comprehensive troubleshooting

## Quick Start Guide

### Step 1: Run the SQL Script

**Option A: Automated (Recommended)**
```bash
cd nestjs-backend/database
setup-database.bat          # Windows
./setup-database.sh         # Linux/Mac
```

**Option B: Manual**
```bash
psql -U postgres -d skoolcampus -f nestjs-backend/database/01_create_tables.sql
```

### Step 2: Generate Prisma Client
```bash
cd nestjs-backend
npm run prisma:generate
```

### Step 3: Start the Backend
```bash
npm run start:dev
```

### Step 4: Verify
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

## Database Connection Details

```
Host:     localhost
Port:     5432
Database: skoolcampus
Username: postgres
Password: postgres
Schema:   public
```

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/skoolcampus?schema=public
```

## Key Features Implemented

### 1. Data Integrity
- ✅ All foreign key relationships enforced
- ✅ Unique constraints on usernames, register numbers
- ✅ Cascade deletes where appropriate
- ✅ NOT NULL constraints on required fields

### 2. Performance Optimization
- ✅ Indexes on frequently queried columns:
  - `login_credential`: username, user_id, role
  - `student`: register_no, branch_id, parent_id
  - `staff`: staff_id, branch_id
  - `enroll`: student_id, class_id, session_id
  - Attendance tables: enroll_id/staff_id, date
  - Fee tables: student_id, allocation_id
  - Transactions: branch_id, date

### 3. Automatic Updates
- ✅ Triggers on 11 tables for auto-updating `updated_at`
- ✅ Timestamp management handled by PostgreSQL

### 4. PostgreSQL-Specific Features
- ✅ SERIAL type for auto-increment IDs
- ✅ TIMESTAMP for datetime fields
- ✅ SMALLINT for boolean-like fields
- ✅ Proper TEXT and VARCHAR types
- ✅ DECIMAL for currency/amounts

## Migration from MySQL

All MySQL-specific types have been converted:

| MySQL Type | PostgreSQL Type | Tables Affected |
|------------|----------------|-----------------|
| `TINYINT` | `SMALLINT` | login_credential, branch, session |
| `DATETIME` | `TIMESTAMP` | All timestamp columns |
| `INT AUTO_INCREMENT` | `SERIAL` | All ID columns |
| Other types | Same | VARCHAR, TEXT, DATE, DECIMAL |

## Database Schema Highlights

### Relationships
- Student → Parent (many-to-one)
- Student → Branch (many-to-one)
- Enroll → Student, Class, Section, Session (many-to-one)
- Attendance → Enroll/Staff (many-to-one)
- Fee Payment → Fee Allocation (many-to-one)

### Role System
```
1 = Superadmin
2 = Admin
3 = Teacher
4 = Accountant
5 = Librarian
6 = Parent
7 = Student
```

### Attendance Status Codes
```
P = Present
A = Absent
L = Late
H = Holiday
```

## Verification Commands

### Check Tables
```sql
psql -U postgres -d skoolcampus -c "\dt"
```

### Check Foreign Keys
```sql
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS references
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY';
```

### Check Indexes
```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Test Connection
```bash
psql -U postgres -d skoolcampus -c "SELECT version();"
```

## Troubleshooting

### Common Issues

1. **"psql: command not found"**
   - Install PostgreSQL or add to PATH
   - Windows: `C:\Program Files\PostgreSQL\15\bin`

2. **"database does not exist"**
   ```bash
   psql -U postgres -c "CREATE DATABASE skoolcampus;"
   ```

3. **"password authentication failed"**
   - Check PostgreSQL is using correct password
   - Verify pg_hba.conf settings

4. **"permission denied"**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE skoolcampus TO postgres;
   ```

See `SETUP_INSTRUCTIONS.md` for detailed troubleshooting.

## Next Steps

1. ✅ Database schema created
2. ✅ Prisma schema updated
3. ✅ Environment configured
4. ⏭️ Run: `npm run prisma:generate`
5. ⏭️ Run: `npm run start:dev`
6. ⏭️ Test API: http://localhost:3000/api/docs

## Files Reference

```
nestjs-backend/
├── database/
│   ├── 01_create_tables.sql         # Main SQL schema
│   ├── setup-database.bat           # Windows setup script
│   ├── setup-database.sh            # Linux/Mac setup script
│   ├── README.md                    # Quick reference
│   └── SETUP_INSTRUCTIONS.md        # Detailed guide
├── prisma/
│   └── schema.prisma                # Updated for PostgreSQL
└── .env                             # PostgreSQL connection string
```

## Support

For issues:
1. Check PostgreSQL service is running
2. Verify database 'skoolcampus' exists
3. Check credentials are correct
4. Review detailed logs in PostgreSQL
5. See SETUP_INSTRUCTIONS.md for full troubleshooting

---

## Summary

✅ **All SQL scripts created and ready to use**
✅ **Prisma schema updated for PostgreSQL**
✅ **Environment variables configured**
✅ **Automated setup scripts provided**
✅ **Comprehensive documentation included**

**You're ready to set up your database!** 🚀

Run the setup script and start your backend server.
