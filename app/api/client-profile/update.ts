import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { contactEmail, companyName, address, phone, contactRole, password } = body;

  try {
    // Hash le mot de passe si présent
    const hashedPassword = password ? await hash(password, 10) : undefined;

    const updated = await prisma.client.update({
      where: { contactEmail }, // ← met à jour via l’email unique
      data: {
        companyName,
        address,
        phone,
        contactRole,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    return NextResponse.json({ success: true, client: updated });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

