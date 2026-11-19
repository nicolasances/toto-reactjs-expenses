import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { StoredUser } from "@/model/user";

const cookies = new Cookies();
const USER_KEY = "user";

/**
 * Claims of the Toto JWT that the app uses.
 */
interface TotoTokenClaims {
    user: string;       // The email of the user the token was issued to
}

/**
 * Builds the user to store from a Toto token.
 *
 * @param {string} idToken - the Toto JWT returned by the auth API
 *
 * @returns {StoredUser} the user, with name and email taken from the "user" claim
 */
export function userFromToken(idToken: string): StoredUser {

    const decodedToken = jwtDecode<TotoTokenClaims>(idToken);

    return { name: decodedToken.user, email: decodedToken.user, idToken: idToken };
}

/**
 * Reads the user stored in localStorage and mirrors it in the "user" cookie (the API layer reads the token from the cookie).
 *
 * @returns {StoredUser | null} the stored user, or null if the user never signed in
 */
export function getStoredUser(): StoredUser | null {

    const storedUser = window.localStorage.getItem(USER_KEY);

    if (!storedUser) return null;

    const user = JSON.parse(storedUser) as StoredUser;

    cookies.set(USER_KEY, user, { path: '/' });

    return user;
}

/**
 * Persists the signed-in user in localStorage and in the "user" cookie.
 *
 * @param {StoredUser} user - the user to persist
 */
export function storeUser(user: StoredUser): void {

    cookies.set(USER_KEY, user, { path: '/' });

    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Returns the currently signed-in user from the "user" cookie.
 * Use this in components that need the user's email (several APIs take it as a query param).
 *
 * @returns {StoredUser | undefined} the user, or undefined if not signed in
 */
export function getCurrentUser(): StoredUser | undefined {

    return cookies.get(USER_KEY);
}
