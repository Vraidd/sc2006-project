import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
  tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false }
});

export async function sendVerificationEmail(email: string, token: string, name: string) {
    // lib/email.ts - Update verificationUrl
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
  const verificationUrl = `${baseUrl}/verify-email?token=${token}`
  
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5;">Welcome to PetCare! 🐾</h1>
        </div>
        
        <p>Hi ${name},</p>
        
        <p>Thank you for registering with PetCare! Please verify your email address to get started.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4F46E5; 
                    color: white; 
                    padding: 14px 30px; 
                    text-decoration: none; 
                    border-radius: 5px;
                    font-weight: bold;
                    display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #4F46E5; word-break: break-all;">${verificationUrl}</p>
        
        <p>This link will expire in 24 hours.</p>
        
        <p>If you didn't create an account with PetCare, you can safely ignore this email.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px; text-align: center;">
          &copy; ${new Date().getFullYear()} PetCare. All rights reserved.
        </p>
      </body>
      </html>
    `,
  };
  
  await transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to Pawsport!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to PetCare</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4F46E5;">Welcome to PetCare, ${name}! 🎉</h1>
        </div>
        
        <p>Your email has been successfully verified.</p>
        
        <p>You are now part of the Pawsport community!</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="background-color: #4F46E5; 
                    color: white; 
                    padding: 14px 30px; 
                    text-decoration: none; 
                    border-radius: 5px;
                    font-weight: bold;
                    display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        
        <p>If you have any questions, feel free to contact our support team.</p>
        
        <p>Best regards,<br>The PetCare Team</p>
      </body>
      </html>
    `,
  };
  
  await transporter.sendMail(mailOptions);
}