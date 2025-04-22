// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <header className="text-center py-32 bg-white">
        <h1 className="text-6xl font-bold mb-4 text-black">TrustedMatch</h1>
        <p className="text-2xl text-gray-700 max-w-2xl mx-auto leading-snug">
          We enable GDPR-compliant audience matching between platforms and brands.
        </p>
        <Link
          href="/demo"
          className="inline-block mt-8 px-8 py-4 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
        >
          Ask for a Demo
        </Link>
      </header>

      {/* Features */}
      +<main
id="features"
className="grid md:grid-cols-2 gap-8 px-6 py-12 max-w-6xl mx-auto scroll-mt-16 -mt-[2cm]"
      >
        <Link
          href="/features/architecture"
          className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2 text-black">
            GDPR‑First Architecture
          </h2>
          <p className="text-gray-700">
            Client‑side pseudonymization of customer data before processing…
          </p>
        </Link>

        <Link
          href="/features/marketplaces"
          className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2 text-black">
            Marketplaces &amp; Brands
          </h2>
          <p className="text-gray-700">
            Measure your audience overlap without file exchanges…
          </p>
        </Link>

        <Link
          href="/features/psi"
          className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2 text-black">
            Private Set Intersection (PSI)
          </h2>
          <p className="text-gray-700">
            Cryptographic intersection without revealing underlying data…
          </p>
        </Link>

        <Link
          href="/features/consent"
          className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2 text-black">
            No Consent Headaches
          </h2>
          <p className="text-gray-700">
            Pseudonymized hashes → no extra end‑user consent needed…
          </p>
        </Link>
      </main>
    </>
  );
}

