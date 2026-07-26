import { NextResponse } from "next/server";
import { isEmailConfigured } from "@/lib/email-config";
import { sendContactEmail } from "@/lib/send-contact-email";

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitize(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json({ error: "email_not_configured" }, { status: 503 });
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const name = sanitize(body.name ?? "", 120);
  const email = sanitize(body.email ?? "", 254);
  const subject = sanitize(body.subject ?? "", 200);
  const message = sanitize(body.message ?? "", 5000);

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    await sendContactEmail({ name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email failed:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
