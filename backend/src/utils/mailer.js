import nodemailer from 'nodemailer';

export const sendOTPEmail = async (toEmail, otp, purpose = 'Verification') => {
  try {
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const from = process.env.MAIL_FROM || user;

    if (!user || !pass) {
      console.warn('⚠️ SMTP/Email credentials not set. Logging OTP to console:');
      console.log(`🔑 [OTP for ${toEmail}] (${purpose}): ${otp}`);
      return { success: true, mocked: true };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"VCLT Support" <${from}>`,
      to: toEmail,
      subject: `VCLT ${purpose} OTP Code`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4f46e5; text-align: center;">VCLT (Video Call Language Translator)</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for <strong>${purpose}</strong> is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; background: #eef2ff; color: #4338ca; border-radius: 6px;">${otp}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} VCLT. All rights reserved.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 OTP email sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send OTP email to ${toEmail}:`, error.message);
    console.log(`🔑 [FALLBACK CONSOLE OTP for ${toEmail}]: ${otp}`);
    return { success: true, fallback: true, error: error.message };
  }
};
