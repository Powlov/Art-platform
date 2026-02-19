import nodemailer from 'nodemailer';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
const FROM_NAME = process.env.FROM_NAME || 'ART BANK Platform';

// Create transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Check if email is configured
 */
export function isEmailConfigured(): boolean {
  return !!(SMTP_USER && SMTP_PASS);
}

/**
 * Send email
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<boolean> {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.warn('[Email] Email not configured, skipping send');
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    console.log(`[Email] Sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}

/**
 * Email template for artwork approval
 */
export async function sendArtworkApprovedEmail(
  artistEmail: string,
  artistName: string,
  artworkTitle: string,
  artworkId: number
): Promise<boolean> {
  const subject = '🎉 Ваше произведение одобрено!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Произведение одобрено!</h1>
        </div>
        <div class="content">
          <p>Здравствуйте, ${artistName}!</p>
          
          <p>Отличные новости! Ваше произведение <strong>"${artworkTitle}"</strong> прошло модерацию и одобрено нашей командой.</p>
          
          <p>Теперь оно доступно на платформе и его могут видеть все пользователи. Для произведения автоматически сгенерирован цифровой паспорт с блокчейн-верификацией.</p>
          
          <a href="https://artbank.market/artwork/${artworkId}" class="button">Посмотреть произведение</a>
          
          <p>Спасибо, что доверяете ART BANK Platform!</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 ART BANK Platform. Все права защищены.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: artistEmail, subject, html });
}

/**
 * Email template for artwork rejection
 */
export async function sendArtworkRejectedEmail(
  artistEmail: string,
  artistName: string,
  artworkTitle: string,
  reason: string
): Promise<boolean> {
  const subject = '❌ Произведение отклонено';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reason { background: #fff; border-left: 4px solid #f5576c; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Требуется доработка</h1>
        </div>
        <div class="content">
          <p>Здравствуйте, ${artistName}!</p>
          
          <p>Ваше произведение <strong>"${artworkTitle}"</strong> было рассмотрено нашей командой модераторов.</p>
          
          <p>К сожалению, на данном этапе мы не можем опубликовать это произведение. Причина:</p>
          
          <div class="reason">
            <strong>Причина отклонения:</strong><br>
            ${reason}
          </div>
          
          <p>Пожалуйста, учтите эти замечания и попробуйте подать произведение снова после внесения необходимых изменений.</p>
          
          <a href="https://artbank.market/artworks/submit" class="button">Подать произведение</a>
          
          <p>Мы ценим ваше творчество и надеемся увидеть ваши работы на платформе!</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 ART BANK Platform. Все права защищены.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: artistEmail, subject, html });
}

/**
 * Email template for new artwork submission (to admin)
 */
export async function sendNewArtworkNotificationEmail(
  artworkTitle: string,
  artistName: string,
  artworkId: number
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || SMTP_USER;
  
  if (!adminEmail) {
    console.warn('[Email] Admin email not configured');
    return false;
  }

  const subject = '🎨 Новое произведение на модерацию';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info { background: #fff; padding: 15px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Новое произведение</h1>
        </div>
        <div class="content">
          <p>На модерацию поступило новое произведение:</p>
          
          <div class="info">
            <strong>Название:</strong> ${artworkTitle}<br>
            <strong>Художник:</strong> ${artistName}<br>
            <strong>ID:</strong> #${artworkId}
          </div>
          
          <p>Пожалуйста, проверьте и одобрите или отклоните произведение.</p>
          
          <a href="https://artbank.market/admin/moderation" class="button">Перейти к модерации</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: adminEmail, subject, html });
}

/**
 * Email template for purchase confirmation
 */
export async function sendPurchaseConfirmationEmail(
  buyerEmail: string,
  buyerName: string,
  artworkTitle: string,
  artworkId: number,
  price: number,
  transactionId: string
): Promise<boolean> {
  const subject = '🎉 Покупка подтверждена!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: #fff; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Покупка подтверждена!</h1>
        </div>
        <div class="content">
          <p>Здравствуйте, ${buyerName}!</p>
          
          <p>Поздравляем с приобретением произведения искусства!</p>
          
          <div class="order-details">
            <h3>Детали заказа:</h3>
            <p><strong>Произведение:</strong> ${artworkTitle}</p>
            <p><strong>Цена:</strong> $${(price / 100).toFixed(2)}</p>
            <p><strong>ID транзакции:</strong> ${transactionId}</p>
          </div>
          
          <p>Цифровой паспорт произведения и документы о праве собственности доступны в вашем профиле.</p>
          
          <a href="https://artbank.market/artwork-passport/${artworkId}" class="button">Просмотреть паспорт</a>
          
          <p>Спасибо за покупку на ART BANK Platform!</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 ART BANK Platform. Все права защищены.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: buyerEmail, subject, html });
}

/**
 * Email template for sale notification (to seller)
 */
export async function sendSaleNotificationEmail(
  sellerEmail: string,
  sellerName: string,
  artworkTitle: string,
  price: number,
  buyerName: string
): Promise<boolean> {
  const subject = '💰 Ваше произведение продано!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .sale-details { background: #fff; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .amount { font-size: 36px; color: #11998e; font-weight: bold; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Продажа состоялась!</h1>
        </div>
        <div class="content">
          <p>Здравствуйте, ${sellerName}!</p>
          
          <p>Отличные новости! Ваше произведение было продано!</p>
          
          <div class="sale-details">
            <p><strong>Произведение:</strong> ${artworkTitle}</p>
            <p><strong>Покупатель:</strong> ${buyerName}</p>
            <div class="amount">$${(price / 100).toFixed(2)}</div>
          </div>
          
          <p>Средства будут зачислены на ваш кошелёк в течение 24 часов после завершения транзакции.</p>
          
          <a href="https://artbank.market/wallet" class="button">Проверить баланс</a>
          
          <p>Поздравляем с успешной продажей!</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 ART BANK Platform. Все права защищены.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: sellerEmail, subject, html });
}
