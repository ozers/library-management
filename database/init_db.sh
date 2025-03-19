#!/bin/bash

# Check if running inside Docker
if [ -f /.dockerenv ]; then
    # Docker environment
    DB_HOST="db"
    DB_PORT="5432"
    SCRIPT_DIR="/usr/src/app/database"
else
    # Local environment
    DB_HOST="localhost"
    DB_PORT="5432"
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

# Database configuration
DB_NAME="library_db"
DB_USER="library_admin"
DB_PASSWORD="library_admin_pw"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to execute SQL file
execute_sql_file() {
    local file=$1
    echo -e "${GREEN}Executing $file...${NC}"
    
    if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file"; then
        echo -e "${GREEN}Successfully executed $file${NC}"
    else
        echo -e "${RED}Error executing $file${NC}"
        exit 1
    fi
}

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
until PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c '\q' 2>/dev/null; do
    echo -e "${YELLOW}PostgreSQL is unavailable - sleeping${NC}"
    sleep 1
done
echo -e "${GREEN}PostgreSQL is up and running${NC}"

# Create database if it doesn't exist
echo -e "${GREEN}Creating database if it doesn't exist...${NC}"
PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || true

# Execute schema file
execute_sql_file "$SCRIPT_DIR/schema/create_initial_schema.sql"

# Execute seed files in order
for seed_file in "$SCRIPT_DIR/seeds"/*.sql; do
    if [ -f "$seed_file" ]; then
        execute_sql_file "$seed_file"
    fi
done

echo -e "${GREEN}Database initialization completed successfully!${NC}" 