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
    subject: "Set your password",
    html: `
      <h3>Password Reset</h3>
      <p>Click the link below to set your password:</p>
      <a href="${resetUrl}">Set Password</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
};
