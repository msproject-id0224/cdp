<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $notificationData = $this->getNotificationData($user);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'unread_notifications'       => $notificationData['list'],
                'unread_notifications_count' => $notificationData['count'],
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'error'   => fn () => $request->session()->get('error'),
                'success' => fn () => $request->session()->get('success'),
            ],
            'locale'       => app()->getLocale(),
            'translations' => $this->getTranslations(),
        ];
    }

    protected function getNotificationData($user): array
    {
        if (! $user) {
            return ['list' => [], 'count' => 0];
        }

        return Cache::remember("user_notifications_{$user->id}", 30, function () use ($user) {
            $all = $user->unreadNotifications()->get();
            return [
                'list'  => $all->take(5)->values(),
                'count' => $all->count(),
            ];
        });
    }

    protected function getTranslations(): array
    {
        $locale = app()->getLocale();

        return Cache::remember("translations_{$locale}", 600, function () use ($locale) {
            $path = base_path("lang/{$locale}.json");
            if (file_exists($path)) {
                $json = json_decode(file_get_contents($path), true);
                return is_array($json) ? $json : [];
            }
            return [];
        });
    }
}
