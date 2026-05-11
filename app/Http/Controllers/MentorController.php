<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MentorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $mentors = User::where('role', User::ROLE_MENTOR)->get();

        return Inertia::render('Mentor/Index', [
            'mentors' => $mentors,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Mentor/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|in:admin,mentor,participant',
            'age_group' => 'nullable|string',
            'age' => 'nullable|integer',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:male,female',
            'phone_number' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'experience' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'nickname' => $validated['nickname'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'age_group' => $validated['age_group'],
            'age' => $validated['age'],
            'date_of_birth' => $validated['date_of_birth'],
            'gender' => $validated['gender'],
            'phone_number' => $validated['phone_number'],
            'specialization' => $validated['specialization'],
            'experience' => $validated['experience'],
            'bio' => $validated['bio'],
            'is_active' => true,
        ]);

        return to_route('dashboard')->with('success', 'Mentor created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $mentor): Response
    {
        // Ensure the user is a mentor
        if (!$mentor->isMentor()) {
            abort(404);
        }

        return Inertia::render('Mentor/Edit', [
            'mentor' => $mentor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $mentor): RedirectResponse
    {
        if (!$mentor->isMentor()) {
            abort(404);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $mentor->id,
            'age_group' => 'nullable|string',
            'age' => 'nullable|integer',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|in:male,female',
            'phone_number' => 'nullable|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'experience' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $mentor->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'nickname' => $validated['nickname'],
            'email' => $validated['email'],
            'age_group' => $validated['age_group'],
            'age' => $validated['age'],
            'date_of_birth' => $validated['date_of_birth'],
            'gender' => $validated['gender'],
            'phone_number' => $validated['phone_number'],
            'specialization' => $validated['specialization'],
            'experience' => $validated['experience'],
            'bio' => $validated['bio'],
        ]);


        return to_route('mentors.index')->with('success', 'Mentor updated successfully.');
    }

    /**
     * Toggle the active status of the specified resource.
     */
    public function toggleStatus(User $mentor): RedirectResponse
    {
        if (!$mentor->isMentor()) {
            abort(404);
        }

        $mentor->update([
            'is_active' => !$mentor->is_active,
        ]);

        return back();
    }
}
