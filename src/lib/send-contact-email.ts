import nodemailer from "nodemailer";
import { getSmtpConfig } from "@/lib/email-config";

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(payload: ContactEmailPayload) {
  const { host, port, secure, user, pass, to } = getSmtpConfig();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const text = [
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Assunto: ${payload.subject}`,
    "",
    payload.message,
  ].join("\n");

  await transporter.sendMail({
    from: `"Sem Talento Studio" <${user}>`,
    to,
    replyTo: payload.email,
    subject: `[Site] ${payload.subject}`,
    text,
  });
}
