import localFont from "next/font/local";
import "./globals.css";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}

          <BottomNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
