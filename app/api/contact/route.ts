import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, company, email, referral, message } = await req.json();
    const msg = {
      to: "michael@trusted-match.com",
      from: "noreply@trusted-match.com",
      replyTo: email,  
      subject: `Nouvelle demande de démo de ${name}`,
      text: `
        Nom    : ${name}
        Société : ${company}
        Email  : ${email}
        Provenance : ${referral}
        Message : ${message}
      `,
      html: `
        <h1>Demande de démo TrustedMatch</h1>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Société :</strong> ${company}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Provenance :</strong> ${referral}</p>
        <p><strong>Message :</strong> ${message}</p>
      `,
    };
    await sgMail.send(msg);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error in contact API:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
