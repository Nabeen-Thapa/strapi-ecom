import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { env } from 'node:process';
dotenv.config();

export const sendEmail = async ({ to, subject, text, html }: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
    console.log("this is email test")
    console.log("this is email testing:",process.env.ADMIN_GMAIL,process.env.ADMIN_GOOGLE_PASS )
  if (!process.env.ADMIN_GMAIL || !process.env.ADMIN_GOOGLE_PASS) {
    console.log("this is email testing:",process.env.ADMIN_GMAIL,process.env.ADMIN_GOOGLE_PASS )
    throw new Error('SMTP credentials are missing in .env!');
  }
 console.log("this is email test")
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.ADMIN_GMAIL,
      pass: process.env.ADMIN_GOOGLE_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your Store" <${process.env.ADMIN_GMAIL}>`,
    to,
    subject,
    text,
    html,
  });
};