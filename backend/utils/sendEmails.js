const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  console.log("Attempting to send email via Resend...");
  console.log("To:", to);

  try {
    const result = await resend.emails.send({
      from: "Aditya Auth App <onboarding@resend.dev>",  // change name only, keep email
      to,
      subject,
      text,
      html: `<p>${text}</p>`, // basic HTML fallback
    });

    console.log("✅ Email sent successfully:", result);
    return result;
  } catch (err) {
    console.error("❌ RESEND EMAIL ERROR:", err);
    throw err;
  }
};

module.exports = sendEmail;