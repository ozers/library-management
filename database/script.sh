#!/bin/bash

# run those below first
#  chmod +x script.sh
#  ./script.sh

# Define container name
CONTAINER_NAME=docker-db-1

# Check if container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    echo "Error: Container '$CONTAINER_NAME' is not running."
    exit 1
fi

# Copy SQL files to the container
docker cp ./database/schema/create_initial_schema.sql $CONTAINER_NAME:/create_initial_schema.sql
docker cp ./database/seeds/1_seed_users_table.sql $CONTAINER_NAME:/1_seed_users_table.sql

# Execute SQL files
docker exec $CONTAINER_NAME psql -U library_admin -d library_db -f /create_initial_schema.sql
docker exec $CONTAINER_NAME psql -U library_admin -d library_db -f /1_seed_users_table.sql

echo "Database initialization complete."
