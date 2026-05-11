# Deployment Checklist

## 1. Initial Server Setup
- [ ] **Clone Repository**: `git clone ...` to `/var/www/html/child-development-program`
- [ ] **Install Dependencies**:
  ```bash
  composer install --optimize-autoloader --no-dev
  npm install && npm run build
  ```
- [ ] **Permissions**:
  ```bash
  chown -R www-data:www-data storage bootstrap/cache
  chmod -R 775 storage bootstrap/cache
  ```

## 2. Environment Configuration (CRITICAL FOR SSL)
- [ ] **Create .env**: `cp .env.example .env`
- [ ] **Generate App Key**: 
  ```bash
  php artisan key:generate
  ```
  **WARNING**: If this step is skipped, the app will return `500 Internal Server Error`, causing SSL validation to fail.
- [ ] **Database Config**: Update DB credentials in `.env`.
- [ ] **URL Config**: Set `APP_URL=https://mitra-project.com`.

## 3. Database
- [ ] **Migrate**: `php artisan migrate --force`

## 4. Web Server (Nginx)
- [ ] **Copy Config**: Copy `setup/nginx.conf` to `/etc/nginx/sites-available/mitra-project.com`.
- [ ] **Enable Site**: `ln -s /etc/nginx/sites-available/mitra-project.com /etc/nginx/sites-enabled/`.
- [ ] **Test Config**: `nginx -t`.
- [ ] **Reload Nginx**: `systemctl reload nginx`.

## 5. SSL Certificate (Let's Encrypt)
- [ ] **Install Certbot**: `apt install certbot python3-certbot-nginx`
- [ ] **Obtain Cert**:
  ```bash
  certbot --nginx -d mitra-project.com -d www.mitra-project.com
  ```
  If this fails with "500 Internal Server Error", double-check Step 2 (App Key).

## 6. Queue Worker (Supervisor)
- [ ] **Setup Supervisor**: Refer to `README.md` for config.
- [ ] **Start Worker**: `supervisorctl reread && supervisorctl update && supervisorctl start cdp-worker:*`
