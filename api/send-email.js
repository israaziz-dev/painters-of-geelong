import { Resend } from 'resend';

/**
 * Vercel serverless function — Painters of Geelong quote form handler.
 *
 * Front-end forms (index.html, contact-us.html) POST JSON here. We re-validate
 * server-side and deliver the enquiry by email via Resend.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY    — required. Without it the function returns 500.
 *   RESEND_FROM_EMAIL — optional verified sender, e.g.
 *                       "Painters of Geelong <quotes@paintersofgeelong.com.au>".
 *                       Defaults to onboarding@resend.dev (test only — delivers
 *                       just to your own Resend account until the domain is verified).
 */

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = 'Paintersofgeelong@outlook.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

const PHONE_RE = /^[0-9+()\s-]{6,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ ok: false, error: 'Email service is not configured.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});

  // Honeypot — bots fill the hidden "company" field; pretend success.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return res.status(200).json({ ok: true });
  }

  const v = (s) => String(s || '').trim();
  const f = {
    name: v(body.name),
    phone: v(body.phone),
    email: v(body.email),
    service: v(body.service),
    preferred_date: v(body.preferred_date),
    property_size: v(body.property_size),
    message: v(body.message),
  };
  const source = v(body.source) || '—';

  // Server-side validation (mirrors the client):
  // required = name, phone, service, preferred_date; optional = email, property_size, message.
  if (!f.name) {
    return res.status(400).json({ ok: false, error: 'Please enter your name.', field: 'name' });
  }
  if (!f.phone || !PHONE_RE.test(f.phone)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid phone number.', field: 'phone' });
  }
  if (!f.service) {
    return res.status(400).json({ ok: false, error: 'Please choose a service.', field: 'service' });
  }
  if (!f.preferred_date) {
    return res.status(400).json({ ok: false, error: 'Please choose a preferred date.', field: 'preferred_date' });
  }
  if (f.email && !EMAIL_RE.test(f.email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.', field: 'email' });
  }

  const rows = [
    ['Name', f.name],
    ['Phone', f.phone],
    ['Email', f.email || '—'],
    ['Service', f.service],
    ['Preferred Date', f.preferred_date],
    ['Property Size', f.property_size || '—'],
    ['Message', f.message || '—'],
    ['Source', source],
  ];

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#1b2030">
    <h2 style="color:#e8762d;margin:0 0 16px">New Quote Request — Painters of Geelong</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-size:15px">
      ${rows
        .map(
          ([k, val]) =>
            `<tr><td style="font-weight:bold;vertical-align:top;border-bottom:1px solid #eee;white-space:nowrap">${esc(k)}</td><td style="vertical-align:top;border-bottom:1px solid #eee">${esc(val).replace(/\n/g, '<br>')}</td></tr>`
        )
        .join('')}
    </table>
  </div>`;

  const text = rows.map(([k, val]) => `${k}: ${val}`).join('\n');

  try {
    const payload = {
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `New Quote Request — ${f.name}`,
      html,
      text,
    };
    // Let staff reply straight to the customer when they left an email.
    if (f.email) payload.replyTo = f.email;

    const { data, error } = await resend.emails.send(payload);
    if (error) {
      // Surfaced in Vercel → Deployments → Functions → api/send-email logs.
      console.error('Resend send failed:', JSON.stringify(error), '| from:', FROM_EMAIL, '| to:', TO_EMAIL);
      return res.status(502).json({
        ok: false,
        error: 'The email service could not send your message. Please call us or try again.',
      });
    }
    console.log('Resend send ok:', data && data.id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-email unexpected error:', err && (err.stack || err.message || err));
    return res.status(500).json({
      ok: false,
      error: 'Unexpected error sending your message. Please call us or try again.',
    });
  }
}
