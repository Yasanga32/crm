import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LeadFlow CRM",
  description: "Modern lead management and sales pipeline CRM",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}

