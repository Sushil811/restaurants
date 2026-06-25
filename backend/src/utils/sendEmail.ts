import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ─── Transporter ─────────────────────────────────────────────────────────────

const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ─── Brand HTML Wrapper ───────────────────────────────────────────────────────

const brandWrapper = (content: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lumiere Restaurant</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background-color: #0D0D0D; padding: 32px 40px; text-align: center; }
    .header h1 { color: #C9A84C; font-size: 36px; margin: 0; font-weight: 400; letter-spacing: 4px; }
    .header p { color: #F5ECD7; font-size: 13px; margin: 6px 0 0; letter-spacing: 2px; }
    .body { padding: 40px; color: #333333; line-height: 1.7; }
    .body h2 { color: #0D0D0D; font-size: 22px; margin-bottom: 16px; }
    .body p { margin: 0 0 16px; font-size: 15px; }
    .highlight-box { background: #F5ECD7; border-left: 4px solid #C9A84C; padding: 16px 20px; border-radius: 4px; margin: 20px 0; }
    .highlight-box p { margin: 0; font-size: 14px; }
    .btn { display: inline-block; background-color: #C9A84C; color: #0D0D0D; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; letter-spacing: 1px; margin: 20px 0; }
    .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .order-table th { background: #0D0D0D; color: #C9A84C; padding: 10px 12px; text-align: left; font-size: 13px; }
    .order-table td { padding: 10px 12px; border-bottom: 1px solid #eeeeee; font-size: 14px; }
    .total-row td { font-weight: bold; background: #F5ECD7; }
    .footer { background: #0D0D0D; padding: 24px 40px; text-align: center; color: #888888; font-size: 12px; }
    .footer a { color: #C9A84C; text-decoration: none; }
    .divider { border: none; border-top: 1px solid #eeeeee; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Lumiere</h1>
      <p>Fine Dining Excellence</p>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Lumiere Restaurant. All rights reserved.</p>
      <p>
        <a href="${process.env.FRONTEND_URL}">Visit our website</a> &nbsp;|&nbsp;
        <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>
      </p>
      <p style="margin-top:12px;color:#555;">If you did not request this email, please ignore it.</p>
    </div>
  </div>
</body>
</html>
`;

// ─── Send Email ───────────────────────────────────────────────────────────────

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Lumiere Restaurant" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

// ─── Email Templates ──────────────────────────────────────────────────────────

/**
 * Welcome email for new users
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  verificationToken?: string
): Promise<void> => {
  const verifyUrl = verificationToken
    ? `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`
    : null;

  const content = `
    <h2>Welcome to Lumiere, ${name}! 🌟</h2>
    <p>We are delighted to have you join our family of fine dining enthusiasts. Your journey to exceptional culinary experiences begins here.</p>
    ${
      verifyUrl
        ? `
    <p>Please verify your email address to unlock all features:</p>
    <a href="${verifyUrl}" class="btn">Verify Email Address</a>
    <p style="font-size:12px;color:#999;">This link expires in 24 hours.</p>
    `
        : ''
    }
    <hr class="divider" />
    <p><strong>What awaits you at Lumiere:</strong></p>
    <ul>
      <li>Curated Michelin-inspired menus crafted by our Executive Chef</li>
      <li>Exclusive reservations and private dining experiences</li>
      <li>Loyalty rewards — earn points with every order</li>
      <li>Priority access to special events and tasting sessions</li>
    </ul>
    <p>We look forward to serving you the finest culinary creations.</p>
    <p>Warm regards,<br /><strong>The Lumiere Team</strong></p>
  `;

  await sendEmail({
    to: email,
    subject: `Welcome to Lumiere Restaurant — Bon Appétit, ${name}!`,
    html: brandWrapper(content),
  });
};

/**
 * Order confirmation email
 */
export const sendOrderConfirmationEmail = async (
  email: string,
  name: string,
  order: {
    orderNumber: string;
    items: { name: string; quantity: number; price: number }[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    estimatedDelivery?: Date;
  }
): Promise<void> => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const estimatedText = order.estimatedDelivery
    ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleString('en-IN')}</p>`
    : '';

  const content = `
    <h2>Order Confirmed! 🎉</h2>
    <p>Dear ${name}, your order has been received and is being prepared with the utmost care.</p>
    <div class="highlight-box">
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
      ${estimatedText}
    </div>
    <table class="order-table">
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr><td colspan="3"><hr style="border:none;border-top:1px solid #ddd;" /></td></tr>
        <tr><td colspan="2">Subtotal</td><td style="text-align:right;">₹${order.subtotal.toFixed(2)}</td></tr>
        <tr><td colspan="2">Delivery Fee</td><td style="text-align:right;">₹${order.deliveryFee.toFixed(2)}</td></tr>
        <tr><td colspan="2">Tax (5%)</td><td style="text-align:right;">₹${order.tax.toFixed(2)}</td></tr>
        ${order.discount > 0 ? `<tr><td colspan="2">Discount</td><td style="text-align:right;color:green;">-₹${order.discount.toFixed(2)}</td></tr>` : ''}
        <tr class="total-row"><td colspan="2"><strong>Total</strong></td><td style="text-align:right;"><strong>₹${order.total.toFixed(2)}</strong></td></tr>
      </tbody>
    </table>
    <p>You can track your order status in real-time through our app or website.</p>
    <a href="${process.env.FRONTEND_URL}/orders/${order.orderNumber}" class="btn">Track Your Order</a>
    <p>Thank you for choosing Lumiere. Bon appétit!</p>
    <p>Warm regards,<br /><strong>The Lumiere Team</strong></p>
  `;

  await sendEmail({
    to: email,
    subject: `Order Confirmed — ${order.orderNumber} | Lumiere Restaurant`,
    html: brandWrapper(content),
  });
};

/**
 * Reservation confirmation email
 */
export const sendReservationConfirmationEmail = async (
  email: string,
  name: string,
  reservation: {
    confirmationCode: string;
    date: Date;
    time: string;
    guests: number;
    occasion: string;
    specialRequests?: string;
  }
): Promise<void> => {
  const formattedDate = new Date(reservation.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const content = `
    <h2>Reservation Confirmed! 🍽️</h2>
    <p>Dear ${name}, your table at Lumiere has been reserved. We are thrilled to welcome you.</p>
    <div class="highlight-box">
      <p><strong>Confirmation Code:</strong> <span style="font-size:20px;color:#C9A84C;font-weight:bold;">${reservation.confirmationCode}</span></p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time:</strong> ${reservation.time}</p>
      <p><strong>Guests:</strong> ${reservation.guests} ${reservation.guests === 1 ? 'person' : 'people'}</p>
      <p><strong>Occasion:</strong> ${reservation.occasion.charAt(0).toUpperCase() + reservation.occasion.slice(1)}</p>
      ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
    </div>
    <p><strong>Please note:</strong> Kindly arrive 10 minutes before your reservation time. If you need to cancel or modify, please do so at least 2 hours in advance.</p>
    <a href="${process.env.FRONTEND_URL}/reservations" class="btn">Manage Reservation</a>
    <hr class="divider" />
    <p><strong>Address:</strong><br />Lumiere Restaurant<br />Fine Dining Excellence<br />Contact: ${process.env.ADMIN_EMAIL}</p>
    <p>We look forward to an unforgettable evening with you.</p>
    <p>Warm regards,<br /><strong>The Lumiere Team</strong></p>
  `;

  await sendEmail({
    to: email,
    subject: `Reservation Confirmed — ${reservation.confirmationCode} | Lumiere Restaurant`,
    html: brandWrapper(content),
  });
};

/**
 * Password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const content = `
    <h2>Password Reset Request 🔐</h2>
    <p>Dear ${name}, we received a request to reset your Lumiere account password.</p>
    <p>Click the button below to reset your password. This link is valid for <strong>30 minutes</strong>.</p>
    <a href="${resetUrl}" class="btn">Reset Password</a>
    <div class="highlight-box">
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p style="word-break:break-all;font-size:12px;color:#666;">${resetUrl}</p>
    </div>
    <p>If you did not request a password reset, please ignore this email or contact us immediately at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p>
    <p>For your security, this link will expire in 30 minutes.</p>
    <p>Warm regards,<br /><strong>The Lumiere Security Team</strong></p>
  `;

  await sendEmail({
    to: email,
    subject: `Reset Your Password — Lumiere Restaurant`,
    html: brandWrapper(content),
  });
};

/**
 * Send OTP for admin password update
 */
export const sendOtpEmail = async (
  email: string,
  name: string,
  otpCode: string
): Promise<void> => {
  const content = `
    <h2>Security Alert: OTP Code 🔐</h2>
    <p>Dear ${name}, we received a request to update your administrator password on Lumiere.</p>
    <p>Please use the following One-Time Password (OTP) to confirm your identity and complete the password update:</p>
    <div class="highlight-box" style="text-align:center;">
      <p style="font-size:32px;letter-spacing:6px;color:#C9A84C;font-weight:bold;margin:10px 0;">${otpCode}</p>
    </div>
    <p>This code is valid for <strong>10 minutes</strong>. Do NOT share this code with anyone, including the Lumiere team.</p>
    <p>If you did not request this update, please change your password immediately or contact our support team.</p>
    <p>Warm regards,<br /><strong>The Lumiere Security Team</strong></p>
  `;

  await sendEmail({
    to: email,
    subject: `${otpCode} is your Lumiere verification code`,
    html: brandWrapper(content),
  });
};
