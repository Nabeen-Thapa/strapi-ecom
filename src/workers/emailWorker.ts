import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendEmail } from '../utils/email';

export const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null, // <- THIS IS REQUIRED
  enableReadyCheck: false,    // optional, helps on Windows
});

const worker = new Worker(
  'email-queue',
  async (job) => {
    const { to, username } = job.data;

    console.log('📨 Sending email to:', to);

    await sendEmail({
      to,
      subject: '✨ Welcome to YourStore — Let the Journey Begin!',
      text: `Hi ${username}, welcome to YourStore! Get ready for an amazing shopping experience.`,
      html: `
        <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to YourStore</title>
            </head>
            <body style="margin:0; padding:0; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          
              <!-- Main Container -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:60px 20px;">
                <tr>
                  <td align="center">
                
                    <!-- Hero Card -->
                    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);">
                  
                    <!-- Decorative Top Bar -->
                    <tr>
                      <td style="height:6px; background:linear-gradient(90deg, #667eea 0%, #764ba2 100%);"></td>
                    </tr>
                  
                    <!-- Logo Section -->
                    <tr>
                      <td style="padding:40px 40px 20px 40px; text-align:center;">
                        <div style="font-size:32px; margin-bottom:12px;">🎨</div>
                        <h1 style="margin:0; font-size:28px; font-weight:800; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
                        YourStore
                        </h1>
                      </td>
                    </tr>
                  
                    <!-- Welcome Message -->
                    <tr>
                      <td style="padding:0 40px 20px 40px; text-align:center;">
                        <h2 style="margin:0 0 12px 0; font-size:32px; color:#1a202c; font-weight:700;">
                        Hey ${username}! 👋
                        </h2>
                        <p style="margin:0; font-size:18px; color:#4a5568; line-height:1.5;">
                        You're officially part of the family
                        </p>
                      </td>
                    </tr>
                  
                      !-- Divider -->
                    <tr>
                      <td style="padding:0 40px;">
                      <hr style="border:none; border-top:2px solid #edf2f7; margin:0;" />
                      </td>
                    </tr>
                  
                    <!-- Main Content -->
                    <tr>
                      <td style="padding:30px 40px;">
                        <p style="margin:0 0 20px 0; color:#2d3748; font-size:16px; line-height:1.6;">
                          We're thrilled to have you on board! Get ready to discover amazing products, exclusive deals, and a seamless shopping experience tailored just for you.
                        </p>
                        
                        <!-- Benefits Grid -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                          <tr>
                            <td width="33%" style="text-align:center; padding:12px;">
                              <div style="font-size:32px; margin-bottom:8px;">🚀</div>
                              <p style="margin:0; font-size:13px; color:#4a5568; font-weight:500;">Fast Delivery</p>
                            </td>
                            <td width="33%" style="text-align:center; padding:12px;">
                              <div style="font-size:32px; margin-bottom:8px;">💎</div>
                              <p style="margin:0; font-size:13px; color:#4a5568; font-weight:500;">Premium Quality</p>
                            </td>
                            <td width="33%" style="text-align:center; padding:12px;">
                              <div style="font-size:32px; margin-bottom:8px;">🎁</div>
                              <p style="margin:0; font-size:13px; color:#4a5568; font-weight:500;">Exclusive Deals</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- CTA Button -->
                        <div style="text-align:center; margin:30px 0 10px 0;">
                          <a href="http://localhost:3000/dashboard" 
                            style="
                              background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color:#ffffff;
                              padding:14px 32px;
                              border-radius:50px;
                              text-decoration:none;
                              font-weight:600;
                              font-size:16px;
                              display:inline-block;
                              box-shadow:0 10px 15px -3px rgba(102,126,234,0.3);
                              transition:transform 0.2s ease;
                            "
                            onmouseover="this.style.transform='translateY(-2px)'"
                            onmouseout="this.style.transform='translateY(0)'">
                            ✨ Explore YourStore
                          </a>
                        </div>
                        
                        <!-- Special Offer -->
                        <div style="background:#f7fafc; border-radius:16px; padding:20px; margin:30px 0 10px 0; text-align:center; border:1px solid #e2e8f0;">
                          <p style="margin:0 0 5px 0; font-size:14px; color:#718096;">🎉 Welcome Special</p>
                          <p style="margin:0; font-size:20px; font-weight:700; color:#2d3748;">
                            Get 15% off your first order
                          </p>
                          <p style="margin:10px 0 0 0; font-size:12px; color:#a0aec0;">
                            Use code: <strong style="color:#667eea">WELCOME15</strong>
                          </p>
                        </div>
                      </td>
                    </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f7fafc; padding:30px 40px 20px 40px; text-align:center;">
                      <div style="margin-bottom:15px;">
                        <a href="#" style="color:#667eea; text-decoration:none; margin:0 10px; font-size:14px;">Help Center</a>
                        <span style="color:#cbd5e0;">•</span>
                        <a href="#" style="color:#667eea; text-decoration:none; margin:0 10px; font-size:14px;">Privacy Policy</a>
                        <span style="color:#cbd5e0;">•</span>
                        <a href="#" style="color:#667eea; text-decoration:none; margin:0 10px; font-size:14px;">Unsubscribe</a>
                      </div>
                      <p style="margin:0 0 10px 0; font-size:12px; color:#a0aec0;">
                        Need help? Contact our support team at 
                        <a href="mailto:support@yourstore.com" style="color:#667eea; text-decoration:none;">support@yourstore.com</a>
                      </p>
                      <p style="margin:0; font-size:11px; color:#cbd5e0;">
                        © ${new Date().getFullYear()} YourStore. All rights reserved.
                      </p>
                    </td>
                  </tr>
                
                </table>
                
                <!-- Bottom Spacing -->
                <table width="560" style="margin-top:20px;">
                  <tr>
                    <td style="text-align:center; font-size:12px; color:#e2e8f0;">
                      This email was sent to ${to}
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
          
        </body>
        </html>
      `,
    });
  },
  { connection }
);

worker.on('completed', (job) => console.log(`✅ Job completed: ${job.id}`));
worker.on('failed', (job, err) => console.error(`❌ Job failed: ${job?.id}`, err));