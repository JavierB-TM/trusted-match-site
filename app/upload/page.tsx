"use client";

import { useState } from "react";

export default function UploadPage() {
  const [emailA, setEmailA] = useState("");
  const [emailB, setEmailB] = useState("");
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fileA || !fileB || !emailA || !emailB) {
      setError("Merci de remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("fileA", fileA);
    formData.append("fileB", fileB);
    formData.append("emailA", emailA.trim());
    formData.append("emailB", emailB.trim());

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setResult(data.message || "Matching terminé !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8">Matching CSV</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Email A</label>
          <input
            type="email"
            value={emailA}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmailA(e.target.value)
            }
            className="border px-3 py-2 rounded w-full"
            placeholder="emailA@example.com"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Fichier CSV A</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFileA(e.target.files?.[0] || null)
            }
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email B</label>
          <input
            type="email"
            value={emailB}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmailB(e.target.value)
            }
            className="border px-3 py-2 rounded w-full"
            placeholder="emailB@example.com"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Fichier CSV B</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFileB(e.target.files?.[0] || null)
            }
            className="w-full"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded mt-4 hover:bg-red-700 transition"
        >
          {loading ? "Traitement..." : "Envoyer"}
        </button>

        {error && <p className="text-red-600 mt-4">❌ {error}</p>}
        {result && <p className="text-green-600 mt-4">✅ {result}</p>}
      </div>
    </div>
  );
}

