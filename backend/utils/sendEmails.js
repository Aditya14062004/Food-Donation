const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (to, subject, text) => {
  try {
    console.log(`📧 Sending email to ${to}`);

    const result = await resend.emails.send({
      from: "Aditya Auth App <onboarding@resend.dev>", // keep email, change name only
      to,
      subject,
      text,
      html: `<p>${text}</p>`
    });

    console.log("✅ Email sent successfully:", result.id);
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};