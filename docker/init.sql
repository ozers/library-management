CREATE USER library_admin WITH PASSWORD 'library_admin_pw';
ALTER USER library_admin WITH SUPERUSER;
CREATE DATABASE library_db;
GRANT ALL PRIVILEGES ON DATABASE library_db TO library_admin; 