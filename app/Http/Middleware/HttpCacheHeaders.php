<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HttpCacheHeaders
{
    public function handle(Request $request, Closure $next, int $maxAge = 300): Response
    {
        $response = $next($request);

        if (! $request->isMethod('GET')) {
            return $response;
        }

        if ($request->user()) {
            // Authenticated pages must never be stored by shared caches
            $response->headers->set('Cache-Control', 'no-store, private');
        } else {
            // Public pages can be cached by browser & CDN
            $response->headers->set(
                'Cache-Control',
                "public, max-age={$maxAge}, stale-while-revalidate=60"
            );
        }

        return $response;
    }
}
