// app/demo/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type FormState = {
  name: string;
  company: string;
  email: string;
  referral: string;
  message: string;
};

export default function DemoRequestPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = Object.fromEntries(formData) as FormState;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        throw new Error("Network response not ok");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Form Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-black">Request a Demo</h1>
          <p className="text-gray-700">
            Fill in the form below and one of our experts will reach out to schedule
            your personalized TrustedMatch demo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Company
              </label>
              <input
                name="company"
                type="text"
                required
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Business Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                How did you hear about us?
              </label>
              <select
                name="referral"
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option>LinkedIn</option>
                <option>Google Search</option>
                <option>Referral</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Message / Questions
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Send Request"}
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-600">Your request has been sent! Thanks.</p>
          )}
          {status === "error" && (
            <p className="text-red-600">
              Something went wrong. Please try again later.
            </p>
          )}
        </div>

        {/* Security Summary */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-black">Security at a Glance</h2>
          <p className="text-gray-700">
            TrustedMatch uses Private Set Intersection and secure enclaves (AWS
            Nitro, Intel SGX) to ensure GDPR compliance and data privacy.{" "}
            <Link href="/technology" className="text-red-600 hover:underline">
              Learn more →
            </Link>
          </p>
        </section>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-red-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

