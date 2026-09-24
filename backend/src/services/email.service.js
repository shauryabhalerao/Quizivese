import nodemailer from 'nodemailer';

/**
 * Creates SMTP transport using environment variables or automatically creates
 * an Ethereal test account for offline/local development email previewing.
 */
const createTransporter = async () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return {
      transporter: nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      }),
      isEthereal: false
    };
  }

  // Fallback to Ethereal auto-generated test SMTP account for development email delivery
  try {
    const testAccount = await nodemailer.createTestAccount();
    return {
      transporter: nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      }),
      isEthereal: true
    };
  } catch (err) {
    console.warn('[Email Service] Failed to create Ethereal test account:', err.message);
    return null;
  }
};

/**
 * Sends a password reset email containing a 6-digit code and direct reset URL
 * @param {string} toEmail - Recipient email address
 * @param {string} resetUrl - Complete frontend URL with reset token
 * @param {string} resetCode - 6-digit verification code
 * @returns {Promise<{ success: boolean, previewUrl?: string, isEthereal?: boolean }>}
 */
export const sendPasswordResetEmail = async (toEmail, resetUrl, resetCode) => {
  console.log(`[Password Reset] Sending reset email & code to ${toEmail}`);
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@quiziverse.io';
  const transportInfo = await createTransporter();

  if (!transportInfo) {
    console.warn('[Password Reset] Email transport unconfigured and test account creation failed');
    return { success: false };
  }

  const { transporter, isEthereal } = transportInfo;

  const mailOptions = {
    from: `"Quiziverse Team" <${fromEmail}>`,
    to: toEmail,
    subject: `Your Quiziverse Password Reset Code: ${resetCode}`,
    text: `Hello,\n\nWe received a request to reset your Quiziverse password.\n\nYour 6-Digit Reset Code: ${resetCode}\n\nOr click this link to reset: ${resetUrl}\n\nThis code and link expire in 30 minutes.\n\nIf you did not request this, please ignore this email.\n\nQuiziverse Team`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0c101c; color: #f8fafc; border-radius: 12px; border: 1px solid #23304e;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #6366f1; margin: 0; font-size: 28px;">Quizi<span style="color: #d946ef;">verse</span></h1>
        </div>
        <div style="background-color: #131d31; padding: 24px; border-radius: 8px; border: 1px solid #23304e;">
          <p style="color: #f8fafc; font-size: 16px; margin-top: 0; font-weight: 500;">Hello,</p>
          <p style="color: #cbd5e1; line-height: 1.6; font-size: 15px;">We received a request to reset your Quiziverse password.</p>
          
          <!-- 6-digit Code Display Box -->
          <div style="background: rgba(99, 102, 241, 0.15); border: 1px dashed #6366f1; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #a5b4fc; margin-bottom: 6px;">Your 6-Digit Reset Code</div>
            <div style="font-size: 32px; font-weight: 800; font-family: monospace; letter-spacing: 6px; color: #38bdf8;">${resetCode}</div>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); font-size: 15px;">
              Reset Password via Direct Link
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin-bottom: 12px;">This code and link expire in 30 minutes and can only be used once.</p>
          <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">If you did not request this password reset, you can safely ignore this email.</p>
          <p style="color: #f8fafc; font-weight: 600; margin: 0; font-size: 15px;">Quiziverse Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Quiziverse. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    let previewUrl = null;
    if (isEthereal) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('[Password Reset] Ethereal email test preview URL:', previewUrl);
    } else {
      console.log('[Password Reset] SMTP Email sent successfully');
    }
    return { success: true, previewUrl, isEthereal };
  } catch (err) {
    console.warn(`[Password Reset] Email delivery failed: ${err.message}`);
    return { success: false, error: err.message };
  }
};


