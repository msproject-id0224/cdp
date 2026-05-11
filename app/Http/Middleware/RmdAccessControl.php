<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\AuditLog;
use App\Models\User;

class RmdAccessControl
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && in_array($user->role, [User::ROLE_ADMIN, User::ROLE_MENTOR])) {
            // Log the unauthorized access attempt
            AuditLog::create([
                'user_id' => $user->id,
                'action' => 'UNAUTHORIZED_ACCESS_ATTEMPT',
                'target_type' => 'RMD_MODULE',
                'target_id' => null, // Module level access
                'details' => [
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'role' => $user->role,
                    'reason' => 'RMD module is restricted to participants only'
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            abort(403, 'Unauthorized. RMD module is restricted to participants only.');
        }

        return $next($request);
    }
}
