# Systech Clinic Management System

A clinic management system with patients, appointments, consultations, dispensing,
inventory, a simple income and expense ledger, staff and clinic settings.

## Run it

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # type-check and production build

The first visit asks you to create the owner account. Owners can create demo logins
under Admin → Demo logins. Each demo login has a username, a password and an
expiry date you choose.

## Storage

- **Local mode (default):** data stays in each browser. Good for trying the system.
- **Supabase mode:** copy `.env.example` to `.env`, add your project URL and anon key,
  then run `supabase/schema.sql` in the Supabase SQL editor.

## Security before real use

Passwords are hashed with PBKDF2 in the browser, and the demo SQL policy is open to
the anon key. This is fine for demonstrations, but do not store real patient
(health) data until login and access rules are enforced on the server.

## Brand

Change the company, product name and tagline in `src/config/brand.ts`.
