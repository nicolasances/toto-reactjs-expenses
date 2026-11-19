import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Toto Payments",
  description: "Toto Payments app",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico", apple: "/Icon-App-60x60@3x.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00acc1",
};

/**
 * Root layout: loads Google Identity Services and wraps every page in the auth provider and guard.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body>
        <div className="toto-app">
          <AuthProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
