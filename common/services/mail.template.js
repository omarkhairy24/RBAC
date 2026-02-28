const { transporter } = require("./transporter");

exports.sendOTPVerificationEmail = async (recipientEmail, otp) => {
  const mailOptions = {
    from: process.env.USER_MAIL,
    to: recipientEmail,
    subject: 'Your Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Verification Code</h2>
        <p>Your OTP is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">
            ${otp}
          </span>
        </div>
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p style="color: #777; font-size: 12px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}