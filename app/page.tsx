// app/page.tsx

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 h-full">
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold text-center mb-6">TrustedMatch</h1>
        <p className="text-lg text-center text-gray-700 max-w-xl mb-8">
          GDPR-compliant audience matching, powered by Private Set Intersection.
        </p>
        <Link
          href="/demo"
          className="bg-red-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-red-700 transition"
        >
          Ask for a Demo
        </Link>
      </div>
    </div>
  );
}

