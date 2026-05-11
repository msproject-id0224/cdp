# Child Development Program (CDP)

## Overview
Child Development Program is a comprehensive platform designed to track and support the holistic development of children. The system includes modules for mentoring, multiple intelligences assessment (RMD), bible reflections, and communication tracking.

## Features
- **Role-Based Access Control (RBAC)**: Admin, Mentor, and Participant roles.
- **OTP-Only Authentication**: Secure passwordless login via Email, SMS, and WhatsApp (Twilio).
- **RMD (Rekam Medis Discipleship)**: 
  - Multiple Intelligences Assessment.
  - Learning Style Quizzes.
  - "The Only One" (Pertemuan 1 & 2).
- **Dynamic Scheduling**: Mentor-Participant meeting scheduling.
- **Communication Log**: Chat and message tracking.
- **Dark Mode Support**: Fully responsive UI with dark/light theme toggle.
- **Multi-Language Support**: English and Indonesian (ID).

## Tech Stack
- **Framework**: Laravel 11
- **Frontend**: React (Inertia.js)
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Queue**: Database/Redis
- **Notifications**: Mail (SMTP), Twilio (SMS/WhatsApp)

## Installation Guide

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL

### Local Setup
1. **Setup Project**
   Extract the source code to your working directory.
   ```bash
   cd child-development-program
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Configuration**
   Copy the example environment file and configure your database and credentials:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Update `.env` with your DB credentials, Mail settings, and Twilio keys.

4. **Database Setup**
   ```bash
   php artisan migrate --seed
   ```

5. **Build Frontend**
   ```bash
   npm run build
   ```

6. **Run Application**
   ```bash
   php artisan serve
   ```
   
7. **Run Queue Worker (Important for Emails)**
   ```bash
   php artisan queue:work
   ```

### Production Deployment (VPS)
1. Ensure your VPS has Nginx/Apache, PHP 8.2+, MySQL, and Supervisor installed.
2. Clone repo to `/var/www/html/child-development-program`.
3. **Follow the detailed checklist in `setup/deploy_checklist.md`**.
4. Set permissions:
   ```bash
   chown -R www-data:www-data storage bootstrap/cache
   chmod -R 775 storage bootstrap/cache
   ```
5. Configure Nginx using the template in `setup/nginx.conf`.
6. Setup Supervisor for Queue Worker:
   Create `/etc/supervisor/conf.d/cdp-worker.conf`:
   ```ini
   [program:cdp-worker]
   process_name=%(program_name)s_%(process_num)02d
   command=php /var/www/html/child-development-program/artisan queue:work database --sleep=3 --tries=3
   autostart=true
   autorestart=true
   user=www-data
   numprocs=2
   redirect_stderr=true
   stdout_logfile=/var/www/html/child-development-program/storage/logs/worker.log
   ```

## Testing
Run the test suite to verify functionality:
```bash
php artisan test
```
Note: Ensure you have a testing database configured or use SQLite (limited support for some migrations).

## Security
- **OTP Hashing**: All OTPs are hashed before storage.
- **Rate Limiting**: Login and OTP requests are rate-limited.
- **Authorization**: Policies and Middleware ensure strict data access control.

## Contribution Guidelines
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License
Proprietary / Closed Source (Mitra Project).
