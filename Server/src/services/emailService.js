import nodemailer from 'nodemailer';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class EmailService {
  static getTransporter() {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass: pass.replace(/\s+/g, '') // Strip spaces if copied directly from Google App Passwords
      }
    });
  }

  /**
   * Sends a formatted Gmail notification when a visitor submits the contact or chat lead form.
   * Non-fatal if Gmail credentials are not configured yet.
   */
  static async sendLeadNotification(lead) {
    const transporter = this.getTransporter();
    if (!transporter) {
      console.warn('[EmailService] Skipped email alert: GMAIL_USER or GMAIL_APP_PASSWORD not set in .env');
      return { sent: false, reason: 'missing_credentials' };
    }

    const toEmail = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || 'ajithkumare101@gmail.com';
    const sourceLabel = lead.source === 'chatbot_lead' ? 'AI Chatbot Lead Form' : 'Portfolio Contact Form';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 20px 24px; border-bottom: 3px solid #10b981;">
          <h2 style="margin: 0; font-size: 18px;">New Portfolio Inquiry</h2>
          <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Received via ${escapeHtml(sourceLabel)}</p>
        </div>
        <div style="padding: 24px; background: #ffffff; color: #1e293b;">
          <p style="margin: 0 0 12px;"><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
          <p style="margin: 0 0 12px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(lead.email)}" style="color: #059669;">${escapeHtml(lead.email)}</a></p>
          <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
          <div style="background: #f8fafc; border-left: 3px solid #10b981; padding: 12px 16px; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(lead.message)}</div>
        </div>
        <div style="padding: 12px 24px; background: #f8fafc; font-size: 11px; color: #64748b;">
          Hit Reply to respond directly to ${escapeHtml(lead.name)} (${escapeHtml(lead.email)}).
        </div>
      </div>
    `;

    const text = [
      `New Portfolio Inquiry (${sourceLabel})`,
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Message:\n${lead.message}`
    ].join('\n\n');

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      replyTo: lead.email,
      subject: `Portfolio Inquiry from ${lead.name}`,
      text,
      html
    });

    console.log(`[EmailService] Gmail notification sent (${info.messageId}) to ${toEmail}`);
    return { sent: true, messageId: info.messageId };
  }
}
