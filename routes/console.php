<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Commands
|--------------------------------------------------------------------------
|
| Run: php artisan schedule:work  (dev)
|       or add to server crontab:
|       * * * * * php /path-to-project/artisan schedule:run >> /dev/null 2>&1
|
*/

// Send QR barcode emails to mentors 10 minutes before their meeting starts.
Schedule::command('attendance:send-qr-emails')
    ->everyMinute()
    ->runInBackground()
    ->withoutOverlapping();
