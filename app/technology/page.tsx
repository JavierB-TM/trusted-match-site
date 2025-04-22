// app/technology/page.tsx
import Link from "next/link";

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-black">Technology</h1>

        {/* PSI Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">
            Private Set Intersection (PSI)
          </h2>
          <p className="text-gray-700">
            PSI is a cryptographic protocol allowing two parties to compute the
            intersection of their datasets without revealing any other elements.
            At TrustedMatch, we support both hashing‑based PSI (Bloom filters)
            for large volumes and advanced MPC‑based PSI for high‑security jobs.
          </p>
        </section>

        {/* Enclaves Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">
            Secure Enclave Technologies
          </h2>
          <p className="text-gray-700">
            We process pseudonymized data inside hardware‑enforced enclaves to
            guarantee confidentiality. Our current providers include:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              <strong>AWS Nitro Enclaves</strong> – isolated, hardware‑level
              VMs for sensitive workloads.
            </li>
            <li>
              <strong>Azure Confidential Computing</strong> – Intel SGX‑based
              secure enclaves on Microsoft Azure.
            </li>
            <li>
              <strong>IBM Confidential Computing</strong> – robust,
              tamper‑resistant enclaves for critical data.
            </li>
          </ul>
        </section>

        {/* Integration Tips */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Integration Tips</h2>
          <p className="text-gray-700">
            Combine PSI and secure enclaves to maximize privacy. Always run a
            GDPR “balancing test” to document legitimate interest, and choose
            solutions that scale with your dataset size.
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/" className="text-red-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
