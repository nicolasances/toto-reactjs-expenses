'use client'

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthAPI } from "@/api/AuthAPI";
import { ExpCatAPI } from "@/api/ExpCatAPI";
import { GOOGLE_CLIENT_ID } from "@/Config";
import { StoredUser } from "@/model/user";
import { getStoredUser, storeUser, userFromToken } from "@/utils/AuthUtil";

/**
 * What the auth context exposes.
 */
interface AuthContextValue {
    user: StoredUser | null;    // The signed-in user, null if not signed in
    loading: boolean;           // True while the stored token is being verified
    signIn: () => void;         // Starts Google Sign-In
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, signIn: () => { } });

/**
 * Provides the signed-in user to the app.
 *
 * Flow (same as the pre-Next.js App.js):
 * - wakes up the expcat API (avoids a cold start)
 * - if a user is stored, verifies its token; if valid the user is signed in
 * - otherwise (no user or expired token) starts Google Sign-In, exchanges the Google credential for a Toto token and stores the user
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<StoredUser | null>(null);
    const [loading, setLoading] = useState(true);

    const signIn = useCallback(() => {

        if (!window.google) {
            setTimeout(signIn, 50);
            return;
        }

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            auto_select: true,
            callback: async (auth) => {

                if (!auth.credential) return;

                try {

                    const totoToken = await new AuthAPI().getTotoToken(auth.credential);

                    const signedInUser = userFromToken(totoToken.token);

                    storeUser(signedInUser);
                    setUser(signedInUser);

                } catch (error) {
                    console.log(error);
                }
            }
        });

        window.google.accounts.id.prompt();

    }, []);

    useEffect(() => {

        /**
         * Restores the stored session, or starts the sign-in if there is none.
         */
        const restoreSession = async () => {

            new ExpCatAPI().smoke().catch(() => { });

            const storedUser = getStoredUser();

            let loginNeeded = !storedUser;

            if (storedUser) {

                const verificationResult = await new AuthAPI().verifyToken(storedUser.idToken);

                if (verificationResult.name === "TokenExpiredError") loginNeeded = true;
            }

            setLoading(false);

            if (loginNeeded) signIn();
            else setUser(storedUser);
        };

        restoreSession();

    }, [signIn]);

    return (
        <AuthContext.Provider value={{ user, loading, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Returns the auth context (signed-in user, loading flag, signIn()).
 */
export function useAuth(): AuthContextValue {

    return useContext(AuthContext);
}
