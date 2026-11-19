/**
 * The signed-in user, as stored in localStorage ("user") and in the "user" cookie.
 * This contract must not change: existing installs rely on it to stay signed in.
 */
export interface StoredUser {
    name: string;       // Display name. Currently the same as the email (taken from the "user" claim of the Toto token)
    email: string;      // The user's email (from the "user" claim of the Toto token)
    idToken: string;    // The Toto JWT, sent as Bearer token on every API call
}
