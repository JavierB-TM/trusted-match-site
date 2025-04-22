// app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Ici tu peux intégrer l'envoi d'email ou stocker en base.
    console.log("Demo request received:", data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error in contact API:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
