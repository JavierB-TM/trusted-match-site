// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import AuthProvider from "../components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TrustedMatch",
  description: "GDPR-compliant customer matching platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
      </head>
      <body className="font-sans h-screen flex flex-col overflow-hidden">
        <div className="flex flex-col h-full">
          <Navbar />
          <AuthProvider>
            <main className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto w-full h-full px-4 py-2">
                {children}
              </div>
            </main>
          </AuthProvider>
          <Footer />
          <BackToTop />
        </div>
      </body>
    </html>
  );
}




