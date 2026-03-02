# Eternal Invitation

## Current State
The admin authentication uses Internet Identity (ICP decentralized login). The flow is:
- Admin visits /admin/login
- Signs in with Internet Identity
- If first admin, enters a Caffeine platform "admin token" to claim ownership
- Internet Identity principal is stored as the admin in the authorization module

This has caused confusion because users do not know the admin token, and Internet Identity is unfamiliar.

## Requested Changes (Diff)

### Add
- Admin registration (first-time setup): form with email + password fields; registers the admin email and hashed password in the backend
- Admin login: email + password fields
- OTP step: after email+password match, backend generates a 6-digit OTP tied to that session; OTP is displayed on-screen (since email sending is a paid feature not enabled on this account) with a note that it simulates what would arrive by email
- Backend functions: `adminSignup(email, passwordHash)`, `requestAdminOtp(email, passwordHash) -> Text` (returns OTP for display), `verifyAdminOtp(email, otp) -> Bool` (verifies and creates session token), `verifyAdminSession(sessionToken) -> Bool`
- Session token: backend stores a session token after OTP verification; frontend stores token in localStorage and sends it with admin API calls
- All admin-protected backend functions must accept a session token instead of (or in addition to) Internet Identity principal check

### Modify
- AdminLoginPage: Replace Internet Identity flow with email/password/OTP multi-step form
  - Step 1 "setup": shown if no admin exists yet -- email + password + confirm password fields
  - Step 1 "login": email + password
  - Step 2 "otp": 6-digit OTP input with countdown timer (5 minutes)
  - Step 3 "done": redirect to dashboard
- AdminDashboard: Replace Internet Identity logout with session-token-based logout (clear localStorage token)
- All useIsCallerAdmin and Internet Identity hooks in admin pages: replaced with session token checks
- Backend admin authorization: add parallel email/password auth system alongside existing Internet Identity (keep existing for backward compat, add new email-based admin auth)

### Remove
- Internet Identity login button from the admin login page
- Admin token / "Claim Ownership" flow
- References to useInternetIdentity in admin-specific auth flow

## Implementation Plan
1. Add backend types and storage: AdminCredentials (email, passwordHash, otpCode, otpExpiry), AdminSession (token, expiry)
2. Add backend functions: adminSignup, requestAdminOtp, verifyAdminOtp, verifyAdminSession, isAdminSetup
3. Update frontend AdminLoginPage with 3-step flow: setup/login → OTP → done
4. Update frontend AdminDashboard to use session token from localStorage instead of Internet Identity
5. Create useAdminSession hook to replace useIsCallerAdmin for admin pages
6. Update all admin-gated queries/mutations to pass session token
