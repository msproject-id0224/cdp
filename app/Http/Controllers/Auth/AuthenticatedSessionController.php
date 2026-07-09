<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

use App\Services\OtpService;

class AuthenticatedSessionController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): \Illuminate\Http\JsonResponse
    {
        $request->authenticate();

        $channel = $request->input('channel', 'mail');
        $user = $request->resolvedUser();
        $email = $user->email;

        $request->session()->put('email', $email);
        $request->session()->put('otp_channel', $channel);
        $request->session()->put(
            'otp_display',
            $channel === 'whatsapp' ? $user->whatsapp_number : $email
        );

        $this->otpService->generateAndSend($email, [$channel]);

        return response()->json([
            'success' => true,
            'nextScreen' => 'otp',
            'message' => 'OTP sent successfully'
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
