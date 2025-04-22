// app/features/[slug]/page.tsx
import Link from "next/link";

const CONTENT: Record<string, { title: string; paragraphs: string[] }> = {
  architecture: {
    title: "GDPR‑First Architecture",
    paragraphs: [
      "At TrustedMatch, data protection drives every decision. Before any customer information leaves your environment, it is pseudonymized client‑side using SHA‑256 hashing. This means we never see raw names, emails or IDs—only irreversible hashes.",
      "Our processing servers are located within the European Economic Area under ISO 27001 accreditation. All data in transit is encrypted via TLS 1.3, and at rest by AES‑256. We run regular penetration tests and vulnerability scans to ensure maximum resilience.",
      "We comply strictly with Article 28 of the GDPR as a data processor. Every matching job is timestamped, logged and purged automatically within 30 days—no long‑term storage, no hidden copies, no surprises.",
      "The result? A zero‑trust, privacy‑by‑design platform that lets you unlock audience insights without sacrificing legal compliance or customer trust."
    ],
  },
  marketplaces: {
    title: "Marketplaces & Brands",
    paragraphs: [
      "TrustedMatch bridges the gap between platforms and brands. Whether you run a digital marketplace or sell directly to consumers, our service lets you measure your audience overlap in full GDPR‑compliance.",
      "By uploading only hashed customer lists, both parties gain insights into shared customers—no file exchanges, no export of personal data. This drives better joint marketing campaigns, optimized loyalty programs, and data‑driven partnerships.",
      "Imagine knowing that 23 % of your marketplace buyers also engage with a specific fashion brand—without ever revealing a single email address. That’s collaboration, de‑risked.",
      "All reports are delivered in minutes, with clear percentages, confidence intervals, and actionable segments—so you can focus on strategy, not compliance."
    ],
  },
  psi: {
    title: "Private Set Intersection (PSI)",
    paragraphs: [
      "Private Set Intersection is a cryptographic protocol that allows two parties to compute the intersection of their datasets—without revealing any elements outside of that intersection.",
      "In practice, both you and your partner send encrypted subsets to our secure enclave. The enclave performs the PSI operation, returning only the count and identifiers of matched hashes, never the full list.",
      "We support both hashing‑based PSI (Bloom filters) for large datasets and advanced multi‑party computation for smaller, high‑security jobs. Performance scales linearly, delivering results in seconds even for millions of entries.",
      "This approach offers provable privacy guarantees: you learn only about common customers—and nothing else."
    ],
  },
  consent: {
    title: "No Consent Headaches",
    paragraphs: [
      "Because TrustedMatch never processes or stores personal data in cleartext, it operates entirely on pseudonymized hashes. Under GDPR, pseudonymized data—when handled properly—is not considered identifiable personal data.",
      "This means you can rely on legitimate interest as your lawful basis for processing, with a minimal risk profile. There’s no need to rebuild your consent banners or worry about cookie walls.",
      "Of course, transparency remains key: document this approach in your privacy policy, inform users about pseudonymization, and provide an easy opt‑out mechanism.",
      "The result is a cleaner user experience, faster roll‑outs, and robust compliance audits without endless consent checkbox menus."
    ],
  },
};

export default function FeaturePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const page = CONTENT[slug];

  if (!page) {
    return (
      <main className="pt-24 min-h-screen bg-white px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Page not found</h1>
          <p className="text-gray-700 mb-6">The feature "{slug}" does not exist.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
        {page.paragraphs.map((p, i) => (
          <p key={i} className="text-gray-700 mb-4">
            {p}
          </p>
        ))}
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
