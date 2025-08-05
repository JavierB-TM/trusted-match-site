"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-black no-underline">
          TrustedMatch
        </Link>
        <div className="space-x-6">
          <Link
            href="/features/architecture"
            className="text-base font-medium text-gray-700 hover:text-red-600 no-underline transition"
          >
            Architecture
          </Link>
          <Link
            href="/features/marketplaces"
            className="text-base font-medium text-gray-700 hover:text-red-600 no-underline transition"
          >
            Marketplaces
          </Link>
          <Link
            href="/features/psi"
            className="text-base font-medium text-gray-700 hover:text-red-600 no-underline transition"
          >
            PSI
          </Link>
          <Link
            href="/features/consent"
            className="text-base font-medium text-gray-700 hover:text-red-600 no-underline transition"
          >
            Consent
          </Link>
          <Link
            href="/features/technology"
            className="text-base font-medium text-gray-700 hover:text-red-600 no-underline transition"
          >
            Technology
          </Link>
          <Link
            href="/espace-client"
            className="text-base font-medium text-gray-700 hover:text-red-600 no-underline transition"
          >
            📁 Espace Client
          </Link>
          <Link
            href="/generate-test-data"
            className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full hover:bg-red-200 transition"
          >
            Test Data Generator
          </Link>
        </div>
      </div>
    </nav>
  );
}

