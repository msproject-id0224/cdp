<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.{userId}', function (User $user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('admin.notifications', function (User $user) {
    return $user->role === User::ROLE_ADMIN;
});

Broadcast::channel('chat.global', function (User $user) {
    return ['id' => $user->id, 'name' => $user->name, 'role' => $user->role];
});
