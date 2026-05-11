
## Troubleshooting: Database Access Denied

If you encounter an error like:
`SQLSTATE[HY000] [1044] Access denied for user 'user-cdp'@'%' to database 'databese-db'`

This means the database user does not have the correct permissions for the database.

### Solution 1: Grant Privileges via Command Line (SSH)
1. Log in to your server via SSH.
2. Access MySQL as root:
   ```bash
   mysql -u root -p
   ```
3. Run the following commands (replace values with your actual config):
   ```sql
   -- Create the user if it doesn't exist (ensure 'localhost' or '%' matches your error)
   CREATE USER IF NOT EXISTS 'user-cdp'@'localhost' IDENTIFIED BY '7AeRLJAx8yW1DgP1xd0O';
   
   -- If your error says 'user-cdp'@'%', create that user too:
   CREATE USER IF NOT EXISTS 'user-cdp'@'%' IDENTIFIED BY '7AeRLJAx8yW1DgP1xd0O';

   -- Grant full permissions to the specific database
   GRANT ALL PRIVILEGES ON `databese-db`.* TO 'user-cdp'@'localhost';
   GRANT ALL PRIVILEGES ON `databese-db`.* TO 'user-cdp'@'%';

   -- Apply changes
   FLUSH PRIVILEGES;
   ```

### Solution 2: CloudPanel / phpMyAdmin
1. Open your database management tool (CloudPanel Database tab or phpMyAdmin).
2. Select the database `databese-db`.
3. Go to the **Privileges** or **Users** tab.
4. Ensure the user `user-cdp` is associated with this database and has **ALL PRIVILEGES**.
