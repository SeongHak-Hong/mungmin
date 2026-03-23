const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testMail() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const recipientEmail = process.env.CONTACT_EMAIL_RECIPIENT || 'sung3045@naver.com';

  console.log('--- SMTP Test Configuration ---');
  console.log(`User: ${smtpUser}`);
  console.log(`Recipient: ${recipientEmail}`);
  console.log('Password length:', smtpPass ? smtpPass.length : 0);
  console.log('-------------------------------');

  if (!smtpUser || !smtpPass) {
    console.error('Error: SMTP_USER or SMTP_PASS is missing in .env.local');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('Connection verified successfully!');

    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Mungmin Test" <${smtpUser}>`,
      to: recipientEmail,
      subject: 'SMTP Connection Test',
      text: 'This is a test email to verify SMTP configuration.',
    });

    console.log('Message sent: %s', info.messageId);
    console.log('SUCCESS: Email delivered to SMTP server.');
  } catch (error) {
    console.error('FAILURE: Error occurred while sending email:');
    console.error(error);
  }
}

testMail();
