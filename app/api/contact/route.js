import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// Use edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Contact form submission (Mocked for Edge Runtime):', body);

    /* 
    // Nodemailer is temporarily disabled because it is incompatible with Cloudflare Edge Runtime.
    // To fix this properly, use a Web API-based email provider (e.g., Resend, SendGrid) or Cloudflare Queues.
    const transporter = nodemailer.createTransport({...});
    await transporter.sendMail(mailOptions);
    */

    return NextResponse.json({ message: 'Success (Mocked)' }, { status: 200 });
  } catch (error) {
    console.error('API Error (contact):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
