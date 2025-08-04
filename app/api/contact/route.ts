import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { name, email, company, referral, message } = await req.json();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0066cc;">New Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>How they heard about us:</strong> ${referral}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
        <hr />
        <p style="font-size: 12px; color: #999;">This message was generated automatically from the Trusted-Match demo form.</p>
      </div>
    `;

    const msg = {
      to: "michael@trusted-match.com",
      from: "noreply@trusted-match.com",
      subject: `Demo request from ${name}`,
      html: htmlContent,
    };

    console.log("Sending main demo request email to internal...");

    await sgMail.send(msg);

    const confirmationMsg = {
      to: email.trim().toLowerCase(),
      from: "noreply@trusted-match.com",
      subject: "Thank you for your demo request – Trusted-Match",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Thank you, ${name}!</h2>
          <p>We have received your demo request for <strong>Trusted-Match</strong>.</p>
          <p>Our team will get back to you shortly to schedule a quick call and guide you through the process.</p>
          <p>In the meantime, feel free to reply to this message if you have any questions.</p>
          <br />
          <p>Best regards,<br />The Trusted-Match Team</p>
          <hr />
          <p style="font-size: 12px; color: #999;">This message is automated. Please do not reply directly.</p>
        </div>
      `,
    };

    console.log("Sending confirmation email to client:", confirmationMsg.to);
    await sgMail.send(confirmationMsg);
    console.log("Confirmation email sent successfully.");

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("SendGrid error:", err.response?.body || err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}