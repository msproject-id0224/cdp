#!/bin/bash

# ============================================================
# Deploy Script — Child Development Program (CDP)
# CloudPanel VPS Deployment
# Usage: ./deploy.sh
# ============================================================

set -e

APP_DIR="/home/cdp/htdocs/yourdomain.com"
PHP_BIN="php8.2"
COMPOSER_BIN="composer"

echo "=============================="
echo " CDP Deployment Started"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================="

cd "$APP_DIR"

# 1. Maintenance mode ON
echo "[1/9] Enabling maintenance mode..."
$PHP_BIN artisan down --secret="bypass-token-123" --render="errors::503" || true

# 2. Pull latest code from GitHub
echo "[2/9] Pulling latest code from GitHub..."
git pull origin main

# 3. Install PHP dependencies (production only)
echo "[3/9] Installing PHP dependencies..."
$COMPOSER_BIN install --no-dev --optimize-autoloader --no-interaction --quiet

# 4. Copy .env.production to .env if .env does not exist
if [ ! -f .env ]; then
    echo "[4/9] Creating .env from .env.production..."
    cp .env.production .env
    $PHP_BIN artisan key:generate
else
    echo "[4/9] .env already exists, skipping..."
fi

# 5. Build frontend assets
echo "[5/9] Building frontend assets..."
if command -v npm &> /dev/null; then
    npm ci --silent
    npm run build
else
    echo "      WARNING: npm not found. Skipping frontend build."
fi

# 6. Clear & cache Laravel configs
echo "[6/9] Optimizing Laravel..."
$PHP_BIN artisan optimize:clear
$PHP_BIN artisan config:cache
$PHP_BIN artisan route:cache
$PHP_BIN artisan view:cache
$PHP_BIN artisan event:cache

# 7. Run database migrations
echo "[7/9] Running database migrations..."
$PHP_BIN artisan migrate --force

# 8. Fix permissions (CloudPanel site user)
echo "[8/9] Fixing file permissions..."
chmod -R 775 storage bootstrap/cache
chown -R $(whoami):$(whoami) storage bootstrap/cache

# 9. Restart queue workers
echo "[9/9] Restarting queue workers..."
if command -v supervisorctl &> /dev/null; then
    sudo supervisorctl restart cdp-worker:* 2>/dev/null || \
    sudo supervisorctl restart all 2>/dev/null || \
    echo "      WARNING: Could not restart supervisor. Run manually: sudo supervisorctl restart all"
else
    $PHP_BIN artisan queue:restart || true
    echo "      INFO: Supervisor not found. Queue restarted via artisan."
fi

# Done — disable maintenance mode
$PHP_BIN artisan up

echo ""
echo "=============================="
echo " Deployment COMPLETE!"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "=============================="
