import { NextResponse } from "next/server";

type Inquiry = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  projectType?: unknown;
  budget?: unknown;
  date?: unknown;
  message?: unknown;
};

const clean = (value: unknown, max = 500) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_INBOX_EMAIL;
  if (!apiKey || !from || !to) {
    return NextResponse.json({ error: "Inquiry delivery is not configured." }, { status: 503 });
  }

  let data: Inquiry;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(data.name, 100);
  const email = clean(data.email, 200);
  const message = clean(data.message, 4000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Please complete your name, email, and project details." }, { status: 400 });
  }

  const details = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${clean(data.phone, 100)}`,
    `Project type: ${clean(data.projectType, 100)}`,
    `Budget: ${clean(data.budget, 100)}`,
    `Preferred date: ${clean(data.date, 30)}`,
    "",
    "Project details:",
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Aura Interiors inquiry from ${name}`,
        text: details,
      }),
    });
    if (!response.ok) return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Email delivery failed." }, { status: 502 });
  }
}
