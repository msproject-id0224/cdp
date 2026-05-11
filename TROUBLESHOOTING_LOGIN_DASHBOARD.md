# Troubleshooting Login & Dashboard Access Issues

## 1. Authentication & API Response Verification
Since this application uses **Inertia.js with Laravel Sanctum/Session**, it does **not** typically use `localStorage` for tokens. Authentication is managed via **HTTP-only cookies** and server-side sessions.

### Verification Steps:
1.  **Check Network Tab:**
    *   Look for the login request (e.g., `POST /login` or `POST /verify-otp`).
    *   **Success Response:** Should be `200 OK` or `302 Found` (redirect).
    *   **Cookies:** Verify that the response sets the `laravel_session` and `XSRF-TOKEN` cookies.
2.  **Storage Inspection:**
    *   Open Browser DevTools -> Application -> Cookies.
    *   Ensure cookies are present and not expired.
    *   *Note:* Do not look for `access_token` in LocalStorage; it won't be there.

## 2. Protected Route Logic
The dashboard is protected by Laravel middleware.
*   **File:** `routes/web.php`
*   **Middleware:** `['auth', 'verified']`
*   **Logic:**
    *   If user is NOT logged in -> Redirect to `/login`.
    *   If user is logged in but email NOT verified -> Redirect to `/verify-email`.
    *   If user is logged in & verified -> Render `Dashboard` component.

## 3. Browser Console Analysis (JavaScript Errors)
If the dashboard shows a blank white screen, it is likely a React rendering error.
*   **Common Errors:**
    *   `Cannot read properties of undefined (reading 'role')` -> User object is incomplete.
    *   `Target container is not a DOM element` -> Root element missing in HTML.
*   **Solution:** We have implemented an **Error Boundary** to catch these errors and display a friendly message instead of a white screen.

## 4. Network Tab & API Calls
*   **Inertia Requests:**
    *   Navigation in Inertia looks like XHR requests with `X-Inertia: true` header.
    *   If `GET /dashboard` returns `401 Unauthorized`, the session cookie might be missing or invalid.
    *   If `GET /dashboard` returns `500 Internal Server Error`, check `storage/logs/laravel.log`.

## 5. Dashboard Component Lifecycle & Rendering
*   **File:** `resources/js/Pages/Dashboard.jsx`
*   **Key Props:** `auth.user`
*   **Safety Checks:**
    *   Always use optional chaining (`user?.role`) or default values when accessing nested properties.
    *   We have updated the component to handle cases where `user.role` might be missing.

## 6. Error Boundary Implementation
We have wrapped the main App component with an `ErrorBoundary`.
*   **File:** `resources/js/Components/ErrorBoundary.jsx`
*   **Function:** Catches JavaScript errors in child components, logs them to console, and shows a fallback UI.
*   **Usage:** Integrated in `resources/js/app.jsx`.

## 7. Loading State Indicators
*   **Inertia Progress:**
    *   Configured in `resources/js/app.jsx`.
    *   Shows a top progress bar (color `#4B5563`) during page navigation.
    *   User feedback is automatic for all Inertia visits.

## 8. Unit & Feature Tests
We have added automated tests to ensure stability.
*   **File:** `tests/Feature/DashboardAccessTest.php`
*   **Scenarios Covered:**
    *   Guest cannot access dashboard (Redirects to login).
    *   Authenticated user can access dashboard.
    *   Admin sees admin panel.
    *   Participant sees participant panel.
    *   Dashboard handles missing user fields gracefully.

## 9. Deployment Checklist (Prevention of Regressions)
Before deploying to production, ensure:
1.  [ ] **Environment Variables:** `SESSION_DRIVER`, `SESSION_DOMAIN`, and `SANCTUM_STATEFUL_DOMAINS` are correctly set in `.env`.
2.  [ ] **Build Assets:** Run `npm run build` to generate fresh assets.
3.  [ ] **Clear Caches:** Run `php artisan optimize:clear` and `php artisan config:cache`.
4.  [ ] **Run Tests:** Execute `php artisan test` to verify all checks pass.
5.  [ ] **Browser Check:** Test login on Chrome, Firefox, and Safari (Incognito mode).
