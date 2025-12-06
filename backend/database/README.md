# Database Setup Guide for SkoolCampus

This guide will help you set up the PostgreSQL database for SkoolCampus.

## Prerequisites

- PostgreSQL 12 or higher installed
- Database name: `skoolcampus` (already created)
- Default credentials: postgres/postgres
- Host: localhost

## Quick Setup

### Option 1: Using psql Command Line

```bash
# Connect to PostgreSQL and run the setup script
psql -U postgres -d skoolcampus -f 01_create_tables.sql
```

### Option 2: Using pgAdmin

1. Open pgAdmin
2. Connect to your PostgreSQL server (localhost)
3. Select the `skoolcampus` database
4. Open Query Tool (Tools > Query Tool)
5. Open the file `01_create_tables.sql`
6. Execute the script (F5 or click Execute button)

### Option 3: Step by Step Commands

```bash
# 1. Login to PostgreSQL
psql -U postgres

# 2. Connect to skoolcampus database
\c skoolcampus

# 3. Run the SQL file
\i 'E:/Ramom School v6.6/Vardhan/nestjs-backend/database/01_create_tables.sql'

# 4. Verify tables were created
\dt

# 5. Exit
\q
```

## Database Schema Overview

The database includes the following tables:

### Authentication & User Management
- `login_credential` - User login credentials
- `login_log` - Login activity tracking
- `reset_password` - Password reset tokens

### Branch/School Management
- `branch` - School branch information
- `global_settings` - System-wide settings

### User Management
- `student` - Student information
- `parent` - Parent/guardian information
- `staff` - Staff/employee information

### Academic Management
- `class` - Class/grade information
- `section` - Class sections
- `session` - Academic sessions/years
- `enroll` - Student enrollments

### Attendance
- `student_attendance` - Student attendance records
- `staff_attendance` - Staff attendance records

### Fee Management
- `fee_allocation` - Fee assignments to students
- `fee_groups` - Fee group definitions
- `fee_groups_details` - Fee structure details
- `fee_payment_history` - Payment records

### Accounting
- `transactions` - Financial transactions

## Features Included

1. **Foreign Key Constraints** - All relationships are enforced at database level
2. **Indexes** - Optimized indexes for better query performance
3. **Triggers** - Automatic `updated_at` timestamp updates
4. **Unique Constraints** - Prevent duplicate usernames, register numbers, etc.

## Verification

After running the script, verify the setup:

```sql
-- List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check table structure
\d login_credential
\d student
\d branch

-- Verify foreign keys
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
```

## Connection String

For the NestJS backend, use this connection string in your `.env` file:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skoolcampus?schema=public"
```

## Next Steps

1. Run the SQL script to create all tables
2. Update the `.env` file with the PostgreSQL connection string
3. Run Prisma migrations: `npm run prisma:generate`
4. Start the backend: `npm run start:dev`

## Troubleshooting

### Permission Denied
```bash
# Grant privileges to postgres user
GRANT ALL PRIVILEGES ON DATABASE skoolcampus TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

### Connection Refused
```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
pg_ctl status  # Windows
```

### Table Already Exists
```sql
-- Drop all tables (WARNING: This will delete all data!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

## Support

For issues or questions:
1. Check PostgreSQL logs
2. Verify database connection credentials
3. Ensure PostgreSQL service is running
4. Check firewall settings for port 5432
