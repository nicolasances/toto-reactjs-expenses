'use client'

import { useAuth } from "@/context/AuthContext";

/**
 * Renders the app only once the user is signed in.
 * While the session is being restored it renders an empty screen; when signed out it renders the login button.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {

    const { user, loading, signIn } = useAuth();

    if (loading) return <div className="screen"></div>;

    if (!user) return (
        <div className="toto-login">
            <div className="toto-login-button" onClick={signIn}>
                <div className="sign-in">Login</div>
                <img className="logo" src="/images/google-logo.png" alt="google-logo" />
            </div>
        </div>
    );

    return <>{children}</>;
}
