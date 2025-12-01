#!/bin/bash

# ============================================
# SkoolCampus Database Setup Script for Linux/Mac
# ============================================

echo ""
echo "========================================"
echo " SkoolCampus Database Setup"
echo "========================================"
echo ""

# Check if PostgreSQL is accessible
if ! command -v psql &> /dev/null; then
    echo "ERROR: psql command not found!"
    echo "Please ensure PostgreSQL is installed"
    echo ""
    exit 1
fi

echo "PostgreSQL found!"
echo ""

# Set database credentials
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=postgres
export PGDATABASE=skoolcampus

echo "Connecting to database: $PGDATABASE"
echo "Host: $PGHOST:$PGPORT"
echo "User: $PGUSER"
echo ""

# Execute the SQL script
echo "Running database setup script..."
echo ""

psql -U $PGUSER -d $PGDATABASE -f "01_create_tables.sql"

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo " SUCCESS! Database setup completed!"
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Verify tables: psql -U postgres -d skoolcampus -c \"\\dt\""
    echo "2. Update .env file with connection string"
    echo "3. Run: npm run prisma:generate"
    echo "4. Run: npm run start:dev"
    echo ""
else
    echo ""
    echo "========================================"
    echo " ERROR: Database setup failed!"
    echo "========================================"
    echo ""
    echo "Please check:"
    echo "1. PostgreSQL is running"
    echo "2. Database 'skoolcampus' exists"
    echo "3. User 'postgres' has correct password"
    echo ""
    exit 1
fi
