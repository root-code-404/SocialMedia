const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com', // Replace with your email
    pass: 'password', // Replace with your email password
  },
});

// Function to send a verification email 
const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const mailOptions = {
      from: 'youremail.com', // Replace with your email
      to: email,
      subject: 'Account Verification',
      text: `The Verification Code is ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

// Function to generate a random six-digit verification code
const generateVerificationCode = () => {
  const min = 100000; // Minimum value for a six-digit number
  const max = 999999; // Maximum value for a six-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  sendVerificationEmail,
  generateVerificationCode,
};
