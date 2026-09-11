<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * The user resolved during validation (by email or by WhatsApp number,
     * depending on the chosen channel). Available after validation passes.
     */
    protected ?User $resolvedUser = null;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalize email before validation runs.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower(trim($this->email ?? '')),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->isWhatsappChannel()) {
            return [
                'phone_number' => ['required', 'string'],
                'channel' => ['nullable', 'string', 'in:mail,whatsapp'],
            ];
        }

        return [
            'email' => ['required', 'string', 'email:rfc', 'exists:users,email'],
            'channel' => ['nullable', 'string', 'in:mail,whatsapp'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => __('Email is required'),
            'email.exists'   => __('Email tidak terdaftar.'),
            'phone_number.required' => __('Nomor WhatsApp wajib diisi.'),
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(\Illuminate\Contracts\Validation\Validator $validator): void
    {
        $validator->after(function ($validator) {
            $isWhatsapp = $this->isWhatsappChannel();
            $field = $isWhatsapp ? 'phone_number' : 'email';

            if ($validator->errors()->has($field)) {
                return;
            }

            $user = $isWhatsapp
                ? User::findByWhatsappNumber($this->input('phone_number'))
                : User::where('email', $this->email)->first();

            if (!$user) {
                $validator->errors()->add(
                    $field,
                    $isWhatsapp ? __('Nomor WhatsApp tidak terdaftar.') : __('Email tidak terdaftar.')
                );
                return;
            }

            if (!$user->is_active) {
                $validator->errors()->add($field, __('Akun Anda tidak aktif. Silakan hubungi admin.'));
                return;
            }

            $this->resolvedUser = $user;
        });
    }

    /**
     * The user matched during validation (by email or WhatsApp number).
     */
    public function resolvedUser(): ?User
    {
        return $this->resolvedUser;
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // For OTP login, we only verify that the account exists (handled by validation rules)
        // We do not check password here.

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());
        $field = $this->isWhatsappChannel() ? 'phone_number' : 'email';

        throw ValidationException::withMessages([
            $field => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        $identifier = $this->isWhatsappChannel()
            ? $this->string('phone_number')
            : $this->string('email');

        return Str::transliterate(Str::lower($identifier).'|'.$this->ip());
    }

    /**
     * Whether the request is asking for OTP delivery via WhatsApp.
     */
    protected function isWhatsappChannel(): bool
    {
        return $this->input('channel') === 'whatsapp';
    }
}
