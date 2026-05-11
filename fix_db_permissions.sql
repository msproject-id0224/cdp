-- SQL Fix for Database Access Denied
-- Run this script in your server's database management tool (phpMyAdmin, Adminer, or MySQL CLI)

-- 1. Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `databese-db`;

-- 2. Create the user if it doesn't exist (both localhost and %)
CREATE USER IF NOT EXISTS 'user-cdp'@'localhost' IDENTIFIED BY '7AeRLJAx8yW1DgP1xd0O';
CREATE USER IF NOT EXISTS 'user-cdp'@'%' IDENTIFIED BY '7AeRLJAx8yW1DgP1xd0O';

-- 3. Grant full privileges on the specific database
GRANT ALL PRIVILEGES ON `databese-db`.* TO 'user-cdp'@'localhost';
GRANT ALL PRIVILEGES ON `databese-db`.* TO 'user-cdp'@'%';

-- 4. Apply changes
FLUSH PRIVILEGES;

-- 5. Verify grants (Optional)
SHOW GRANTS FOR 'user-cdp'@'localhost';
SHOW GRANTS FOR 'user-cdp'@'%';
