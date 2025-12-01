# PostgreSQL Database Setup Instructions

Complete guide to set up the SkoolCampus PostgreSQL database.

## Prerequisites

1. **PostgreSQL Installed** (version 12 or higher)
   - Download: https://www.postgresql.org/download/
   - Verify installation: `psql --version`

2. **Database Created**
   - Database name: `skoolcampus`
   - Should already exist (empty)

3. **Credentials**
   - Username: `postgres`
   - Password: `postgres`
   - Host: `localhost`
   - Port: `5432`

## Setup Methods

### Method 1: Automated Script (Recommended)

#### Windows
```bash
cd database
setup-database.bat
```

#### Linux/Mac
```bash
cd database
chmod +x setup-database.sh
./setup-database.sh
```

### Method 2: Manual Setup Using psql

```bash
# 1. Navigate to database folder
cd nestjs-backend/database

# 2. Connect to PostgreSQL and run script
psql -U postgres -d skoolcampus -f 01_create_tables.sql

# 3. Verify tables were created
psql -U postgres -d skoolcampus -c "\dt"
```

### Method 3: Using pgAdmin (GUI)

1. Open **pgAdmin**
2. Connect to your PostgreSQL server
3. Select **skoolcampus** database (right-click → Query Tool)
4. Open file: `01_create_tables.sql`
5. Click **Execute** (F5)
6. Check Messages tab for success/errors

### Method 4: Manual Commands

```bash
# 1. Login to PostgreSQL
psql -U postgres

# 2. Connect to skoolcampus database
\c skoolcampus

# 3. Copy-paste the SQL from 01_create_tables.sql
# OR use the \i command:
\i '/full/path/to/01_create_tables.sql'

# 4. Verify tables
\dt

# 5. Exit
\q
```

## Verification

After running the setup, verify everything is correct:

### 1. Check Tables Created
```sql
psql -U postgres -d skoolcampus

-- List all tables
\dt

-- You should see 19 tables:
-- login_credential, login_log, reset_password
-- branch, global_settings
-- student, parent, staff
-- class, section, session, enroll
-- student_attendance, staff_attendance
-- fee_allocation, fee_groups, fee_groups_details, fee_payment_history
-- transactions
```

### 2. Check Foreign Keys
```sql
-- List all foreign key constraints
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
```

### 3. Check Indexes
```sql
-- List all indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### 4. Check Triggers
```sql
-- List all triggers
SELECT
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
```

## Backend Configuration

After database setup is complete:

### 1. Verify .env File
```bash
# File: nestjs-backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skoolcampus?schema=public"
```

### 2. Install Dependencies
```bash
cd nestjs-backend
npm install
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Verify Prisma Connection
```bash
# Check if Prisma can connect
npx prisma db pull
```

### 5. Start the Backend
```bash
npm run start:dev
```

The backend should start on `http://localhost:3000`

## Database Structure Overview

### Core Tables (19 Total)

#### Authentication (3 tables)
- `login_credential` - User authentication credentials
- `login_log` - Login activity tracking
- `reset_password` - Password reset tokens

#### Configuration (2 tables)
- `branch` - School branch/campus information
- `global_settings` - System-wide settings

#### User Management (3 tables)
- `student` - Student profiles
- `parent` - Parent/guardian profiles
- `staff` - Staff/employee profiles

#### Academic (4 tables)
- `class` - Classes/grades
- `section` - Class sections
- `session` - Academic years/sessions
- `enroll` - Student enrollment records

#### Attendance (2 tables)
- `student_attendance` - Student attendance records
- `staff_attendance` - Staff attendance records

#### Finance (4 tables)
- `fee_allocation` - Fee assignments
- `fee_groups` - Fee group definitions
- `fee_groups_details` - Fee structure details
- `fee_payment_history` - Payment records

#### Accounting (1 table)
- `transactions` - Financial transactions

## Troubleshooting

### Issue: "psql: command not found"

**Solution:**
```bash
# Windows: Add PostgreSQL bin to PATH
# Typical location: C:\Program Files\PostgreSQL\15\bin

# Linux/Mac: Install PostgreSQL client
sudo apt-get install postgresql-client  # Ubuntu/Debian
brew install postgresql                  # macOS
```

### Issue: "database 'skoolcampus' does not exist"

**Solution:**
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE skoolcampus;"
```

### Issue: "password authentication failed for user postgres"

**Solution:**
```bash
# Reset postgres password
# 1. Find pg_hba.conf file
# 2. Change authentication method to 'trust' temporarily
# 3. Restart PostgreSQL
# 4. Reset password:
psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"
# 5. Change pg_hba.conf back to 'md5'
# 6. Restart PostgreSQL
```

### Issue: "permission denied for schema public"

**Solution:**
```sql
-- Grant necessary permissions
psql -U postgres -d skoolcampus

GRANT ALL PRIVILEGES ON DATABASE skoolcampus TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

### Issue: "relation already exists"

**Solution:**
```sql
-- Drop all tables and recreate (WARNING: deletes all data!)
psql -U postgres -d skoolcampus

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then run the setup script again
\i '01_create_tables.sql'
```

### Issue: "Prisma Client not found"

**Solution:**
```bash
cd nestjs-backend
npm install @prisma/client
npm run prisma:generate
```

## Initial Data (Optional)

If you want to add sample data for testing:

```sql
-- Connect to database
psql -U postgres -d skoolcampus

-- Insert default branch
INSERT INTO branch (school_name, status, student_login, parent_login)
VALUES ('Default Campus', 1, 1, 1);

-- Insert default session
INSERT INTO session (name, start_date, end_date, active)
VALUES ('2024-2025', '2024-01-01', '2024-12-31', 1);

-- Insert default admin user (password: admin123)
INSERT INTO login_credential (username, password, role, user_id, active)
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 2, 1, 1);
```

## Next Steps

1. ✅ Database tables created
2. ✅ Prisma schema updated to PostgreSQL
3. ✅ Environment variables configured
4. ⏭️ Generate Prisma client: `npm run prisma:generate`
5. ⏭️ Start backend: `npm run start:dev`
6. ⏭️ Test API endpoints: `http://localhost:3000/api/docs`

## Support

If you encounter issues:

1. **Check PostgreSQL Service**
   ```bash
   # Windows
   services.msc → PostgreSQL

   # Linux
   sudo systemctl status postgresql

   # Mac
   brew services list
   ```

2. **Check Logs**
   - PostgreSQL logs: Usually in `/var/log/postgresql/`
   - NestJS logs: Check terminal output

3. **Database Connection Test**
   ```bash
   psql -U postgres -d skoolcampus -c "SELECT version();"
   ```

## Files Created

- `01_create_tables.sql` - Main database schema
- `setup-database.bat` - Windows setup script
- `setup-database.sh` - Linux/Mac setup script
- `README.md` - Quick reference guide
- `SETUP_INSTRUCTIONS.md` - This detailed guide

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=public

Example:
postgresql://postgres:postgres@localhost:5432/skoolcampus?schema=public
```

---

**Ready to proceed?** Run the setup script and start building! 🚀
