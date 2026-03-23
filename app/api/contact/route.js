import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Use nodejs runtime for nodemailer compatibility
export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, location, detailLocation, content } = body;

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.CONTACT_EMAIL_RECIPIENT || 'sung3045@naver.com';

    if (!smtpUser || !smtpPass) {
      console.error('Missing SMTP configuration (SMTP_USER or SMTP_PASS)');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    console.log('Attempting to send email via Naver SMTP...');
    console.log(`From: ${smtpUser}, To: ${recipientEmail}`);

    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com',
      port: 465,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"멍냥의민족 웹" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `[창업문의] ${name}님의 문의내용입니다.`,
      text: `
[창업문의 상세 내용]

성함: ${name}
연락처: ${phone}
이메일: ${email}
주소: ${location}
상세주소: ${detailLocation}

문의내용:
${content}

---
본 메일은 멍냥의민족 홈페이지 컨택트 섹션에서 발송되었습니다.
      `,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2BC2BD; border-bottom: 2px solid #2BC2BD; padding-bottom: 10px;">[창업문의 상세 내용]</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 10px; border: 1px solid #eee; background: #f9f9f9; width: 120px;"><strong>성함</strong></td><td style="padding: 10px; border: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; background: #f9f9f9;"><strong>연락처</strong></td><td style="padding: 10px; border: 1px solid #eee;">${phone}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; background: #f9f9f9;"><strong>이메일</strong></td><td style="padding: 10px; border: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; background: #f9f9f9;"><strong>주소</strong></td><td style="padding: 10px; border: 1px solid #eee;">${location}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #eee; background: #f9f9f9;"><strong>상세주소</strong></td><td style="padding: 10px; border: 1px solid #eee;">${detailLocation}</td></tr>
          </table>
          <div style="margin-top: 30px; padding: 20px; border: 1px solid #eee; background: #f9f9f9;">
            <strong>문의내용:</strong><br /><p style="white-space: pre-wrap;">${content}</p>
          </div>
          <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">본 메일은 멍냥의민족 홈페이지 컨택트 섹션에서 발송되었습니다.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('--- SMTP SEND ERROR ---');
    console.error('Error Code:', error.code);
    console.error('Error Command:', error.command);
    console.error('Full Error:', error);
    console.error('-----------------------');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
