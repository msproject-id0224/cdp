<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('role', 'admin');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('job_title', 'like', "%{$search}%");
            });
        }

        if ($request->has('sort_by') && $request->has('sort_order')) {
            $sortBy = $request->input('sort_by');
            if ($sortBy === 'name') {
                $query->orderBy('first_name', $request->input('sort_order'))
                      ->orderBy('last_name', $request->input('sort_order'));
            } else {
                $query->orderBy($sortBy, $request->input('sort_order'));
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $admins = $query->paginate(10);

        // If it's an API request, return JSON
        if ($request->wantsJson()) {
            return response()->json($admins);
        }

        // Normally we might render a page, but here we might just return JSON or Partial
        return response()->json($admins);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'   => ['required', 'string', 'max:255'],
            'last_name'    => ['nullable', 'string', 'max:255'],
            'email'        => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'job_title'    => ['nullable', 'string', 'max:255'],
            'password'     => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'first_name'   => $validated['first_name'],
            'last_name'    => $validated['last_name'] ?? null,
            'email'        => $validated['email'],
            'phone_number' => $validated['phone_number'] ?? null,
            'job_title'    => $validated['job_title'] ?? null,
            'password'     => Hash::make($validated['password']),
            'role'         => 'admin',
            'is_active'    => true,
        ]);

        return back()->with('success', 'Admin created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'job_title' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $user->update($validated);

        return back()->with('success', 'Admin updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'Admin deleted successfully.');
    }

    public function toggleStatus(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot deactivate your own account.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return back()->with('success', 'Admin status updated successfully.');
    }
}
