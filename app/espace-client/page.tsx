"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EspaceClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center mt-20">Chargement...</div>;
  }

  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    address: "",
    phone: "",
    contactEmail: session?.user?.email || "",
    contactRole: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/client-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("✅ Informations enregistrées !");
      } else {
        setMessage("❌ Erreur lors de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur soumission:", error);
      setMessage("❌ Erreur serveur.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Espace Client</h1>
      <p className="text-center mb-8 text-gray-600">
        Vous êtes connecté en tant que{" "}
        <span className="font-medium">{session?.user?.email}</span>
      </p>

      {message && (
        <p className="text-center mb-4 text-sm text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="companyName"
          placeholder="Nom de la société"
          onChange={handleChange}
          value={formData.companyName}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="companyType"
          placeholder="Raison sociale"
          onChange={handleChange}
          value={formData.companyType}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="address"
          placeholder="Adresse complète"
          onChange={handleChange}
          value={formData.address}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="phone"
          placeholder="Numéro de téléphone"
          onChange={handleChange}
          value={formData.phone}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="email"
          name="contactEmail"
          placeholder="Adresse email du contact"
          onChange={handleChange}
          value={formData.contactEmail}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="contactRole"
          placeholder="Fonction du contact"
          onChange={handleChange}
          value={formData.contactRole}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Mettre à jour mes infos
        </button>
      </form>
    </div>
  );
}

