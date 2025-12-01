@echo off
REM ============================================
REM SkoolCampus Database Setup Script for Windows
REM ============================================

echo.
echo ========================================
echo  SkoolCampus Database Setup
echo ========================================
echo.

REM Check if PostgreSQL is accessible
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: psql command not found!
    echo Please ensure PostgreSQL is installed and added to PATH
    echo.
    echo Typical PostgreSQL bin location:
    echo C:\Program Files\PostgreSQL\15\bin
    echo.
    pause
    exit /b 1
)

echo PostgreSQL found!
echo.

REM Set database credentials
set PGHOST=localhost
set PGPORT=5432
set PGUSER=postgres
set PGPASSWORD=postgres
set PGDATABASE=skoolcampus

echo Connecting to database: %PGDATABASE%
echo Host: %PGHOST%:%PGPORT%
echo User: %PGUSER%
echo.

REM Execute the SQL script
echo Running database setup script...
echo.

psql -U %PGUSER% -d %PGDATABASE% -f "01_create_tables.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  SUCCESS! Database setup completed!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Verify tables: psql -U postgres -d skoolcampus -c "\dt"
    echo 2. Update .env file with connection string
    echo 3. Run: npm run prisma:generate
    echo 4. Run: npm run start:dev
    echo.
) else (
    echo.
    echo ========================================
    echo  ERROR: Database setup failed!
    echo ========================================
    echo.
    echo Please check:
    echo 1. PostgreSQL is running
    echo 2. Database 'skoolcampus' exists
    echo 3. User 'postgres' has correct password
    echo.
)

pause
