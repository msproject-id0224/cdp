<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class UpdateLastSeen
{
    // Only write to DB once every 5 minutes per user to avoid per-request writes
    private const TTL_SECONDS = 300;

    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user    = Auth::user();
            $cacheKey = "last_seen_{$user->id}";

            if (! Cache::has($cacheKey)) {
                $user->last_seen_at = now();
                $user->saveQuietly();
                Cache::put($cacheKey, true, self::TTL_SECONDS);
            }
        }

        return $next($request);
    }
}
