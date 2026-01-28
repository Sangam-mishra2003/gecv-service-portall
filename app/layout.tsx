"use client";

import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide header/footer on dashboard
  const hideLayout =
    pathname.startsWith("/student/dashboard");

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        {!hideLayout && <Header />}

        <main className="min-h-screen">
          {children}
        </main>

        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
