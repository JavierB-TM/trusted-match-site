import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(req: Request) {
  const formData = await req.formData();
  const emailA = formData.get("emailA")?.toString() || "";
  const emailB = formData.get("emailB")?.toString() || "";
  const fileA = formData.get("fileA") as File;
  const fileB = formData.get("fileB") as File;

  if (!emailA || !emailB || !fileA || !fileB) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  try {
    // Lire contenu CSV A
    const bufferA = Buffer.from(await fileA.arrayBuffer());
    const csvA = bufferA.toString("utf-8").split("\n").map(line => line.trim());

    // Lire contenu CSV B
    const bufferB = Buffer.from(await fileB.arrayBuffer());
    const csvB = bufferB.toString("utf-8").split("\n").map(line => line.trim());

    // Simuler matching : intersection simple
    const matching = csvA.filter(line => csvB.includes(line));
    const matchCount = matching.length;

    // Générer un PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    const text = `Résultat du Matching\n\nEmail A: ${emailA}\nEmail B: ${emailB}\n\nNombre d'emails en commun : ${matchCount}`;
    page.drawText(text, {
      x: 50,
      y: height - 100,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

    // Créer le dossier s'il n'existe pas
    const reportsDir = path.join(process.cwd(), "public", "reports");
    await fs.mkdir(reportsDir, { recursive: true });

    // Nom du fichier PDF
    const filename = `rapport_${emailA}_${new Date().toISOString().split("T")[0]}.pdf`;
    const filePath = path.join(reportsDir, filename);

    // Sauvegarder le PDF
    await fs.writeFile(filePath, pdfBytes);

    return NextResponse.json({
      message: `Matching terminé ! Résultats : ${matchCount} correspondances.`,
      filename,
      url: `/reports/${filename}`,
    });
  } catch (error) {
    console.error("Erreur de matching :", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

