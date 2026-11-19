/**
 * Minimal typing of the Google Identity Services client (https://accounts.google.com/gsi/client),
 * limited to what the app uses.
 */
interface GoogleCredentialResponse {
    credential?: string;    // The Google id token (JWT)
}

interface GoogleIdConfiguration {
    client_id: string | undefined;                              // OAuth client id
    auto_select?: boolean;                                      // Sign in automatically when possible
    callback: (response: GoogleCredentialResponse) => void;     // Called with the credential
}

interface Window {
    google?: {
        accounts: {
            id: {
                initialize: (config: GoogleIdConfiguration) => void;
                prompt: () => void;
            };
        };
    };
}
