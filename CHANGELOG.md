# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Refactored Login flow to use JSON API response instead of Server-side Redirect.
- Updated `AuthenticatedSessionController` to return `JsonResponse` with `{ success: true, nextScreen: 'otp' }`.
- Updated `Login.jsx` to use Axios for form submission and handle manual routing to `/verify-otp`.
- Enhanced error handling in Login flow with try-catch blocks and user-friendly messages.
- Updated `OtpLoginTest` to verify JSON responses for login requests.
