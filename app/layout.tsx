// app/layout.tsx
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Charger Tailwind **avant** le rendu */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      {/* pt-16 décalle tout le contenu sous la NavBar fixe */}
      <body className="pt-16 font-sans min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}


