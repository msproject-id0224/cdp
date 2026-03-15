<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'unread_notifications' => $request->user() ? $request->user()->unreadNotifications()->limit(5)->get() : [],
                'unread_notifications_count' => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
                'success' => fn () => $request->session()->get('success'),
            ],
            'locale' => app()->getLocale(),
            'translations' => $this->getTranslations(),
        ];
    }

    protected function getTranslations()
    {
        $locale = app()->getLocale();
        $path = base_path("lang/{$locale}.json");
        
        if (file_exists($path)) {
            $json = json_decode(file_get_contents($path), true);
            return is_array($json) ? $json : [];
        }

        return [];
    }
}
