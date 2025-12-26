import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // ✅ NOT 465
    secure: false, // TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password
    },
  });
};

export const sendSetPasswordEmail = async (toEmail, resetUrl) => {
  const transporter = createTransporter();

  // 🔍 Optional: verify connection
  await transporter.verify();

  await transporter.sendMail({
    from: `"Attendance System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Set Your Password – Attendance System",
    html: `
  <div style="
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f4f6f8;
    padding: 30px;
  ">
    <div style="
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    ">
      <h2 style="color:#1f2937; margin-bottom: 10px;">
        Set Your Password
      </h2>

      <p style="color:#4b5563; font-size:14px; line-height:1.6;">
        Hello,
      </p>

      <p style="color:#4b5563; font-size:14px; line-height:1.6;">
        You have been invited to access the <strong>Attendance System</strong>.
        Please click the button below to securely set your password.
      </p>

      <div style="text-align:center; margin: 30px 0;">
        <a href="${resetUrl}"
          style="
            background-color:#2563eb;
            color:#ffffff;
            padding:12px 24px;
            text-decoration:none;
            border-radius:6px;
            font-size:15px;
            font-weight:600;
            display:inline-block;
          "
        >
          Set Password
        </a>
      </div>

      <p style="color:#6b7280; font-size:13px; line-height:1.6;">
        ⏰ This link will expire in <strong>15 minutes</strong>.
        If you did not request this, please ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #e5e7eb; margin:25px 0;" />

      <p style="color:#9ca3af; font-size:12px; text-align:center;">
        © ${new Date().getFullYear()} Attendance System. All rights reserved.
      </p>
    </div>
  </div>
  `,
  });
};
