import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, company, referral, message } = await req.json();

    const msg = {
      to: "michael@trusted-match.com", 
      from: "noreply@trusted-match.com",
      subject: `Demo request from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        `Referral: ${referral}`,
        `Message: ${message}`,
      ].join("\n"),
    };

    await sgMail.send(msg);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SendGrid error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
