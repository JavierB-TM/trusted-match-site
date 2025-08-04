import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Sanity check
  if (typeof data.contactEmail !== "string") {
    return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
  }

  try {
    const existing = await prisma.client.findUnique({
      where: { contactEmail: data.contactEmail },
    });

    let saved;

    if (existing) {
      saved = await prisma.client.update({
        where: { contactEmail: data.contactEmail },
        data,
      });
    } else {
      saved = await prisma.client.create({
        data,
      });
    }

    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error("Error in POST /client-profile:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
