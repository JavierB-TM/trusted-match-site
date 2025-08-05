// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} TrustedMatch. All rights reserved.
          </div>
          <div className="space-x-6">
            <Link 
              href="/compare" 
              className="text-sm font-medium text-gray-700 hover:text-red-600 no-underline transition"
            >
              Compare Solutions
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm font-medium text-gray-700 hover:text-red-600 no-underline transition"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm font-medium text-gray-700 hover:text-red-600 no-underline transition"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
