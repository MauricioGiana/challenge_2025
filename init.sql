-- Initial database setup
-- This file is executed when the MySQL container starts for the first time
-- Migrations will handle table creation

USE gaspre_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON gaspre_db.* TO 'gaspre_user'@'%';
FLUSH PRIVILEGES;
