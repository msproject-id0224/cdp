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
            'last_name' => $validated['last_name'] ?? null,
            'nickname' => $validated['nickname'] ?? null,
            'email' => $validated['email'],
            'role' => User::ROLE_MENTOR,
            'age_group' => $validated['age_group'] ?? null,
            'age' => $validated['age'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'phone_number' => $validated['phone_number'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'experience' => $validated['experience'] ?? null,
            'bio' => $validated['bio'] ?? null,
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
            'last_name' => $validated['last_name'] ?? null,
            'nickname' => $validated['nickname'] ?? null,
            'email' => $validated['email'],
            'age_group' => $validated['age_group'] ?? null,
            'age' => $validated['age'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'phone_number' => $validated['phone_number'] ?? null,
            'specialization' => $validated['specialization'] ?? null,
            'experience' => $validated['experience'] ?? null,
            'bio' => $validated['bio'] ?? null,
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
