<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\SetLocaleMiddleware::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\UpdateLastSeen::class,
        ]);

        // Sama seperti web: partisipan yang aktif lewat app mobile juga
        // perlu update last_seen_at, supaya status "online" di fitur chat
        // (ChatService::searchContacts()) akurat untuk kedua sisi.
        $middleware->api(append: [
            \App\Http\Middleware\UpdateLastSeen::class,
        ]);

        $middleware->alias([
            'role'         => \App\Http\Middleware\RoleMiddleware::class,
            'rmd.access'   => \App\Http\Middleware\RmdAccessControl::class,
            'http.cache'   => \App\Http\Middleware\HttpCacheHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
