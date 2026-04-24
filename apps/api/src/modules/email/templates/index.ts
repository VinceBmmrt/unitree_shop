// Minimal HTML email templates — plain, premium, readable on all clients
// For a full design system, migrate to react-email + Resend React SDK

const BASE = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border-radius: 12px; overflow: hidden;">
    <div style="background: #111; border-bottom: 1px solid #222; padding: 24px 40px;">
      <span style="font-size: 20px; font-weight: 600; letter-spacing: -0.5px; color: #fff;">Unitree Robotics</span>
    </div>
    <div style="padding: 40px; line-height: 1.6;">
      {{CONTENT}}
    </div>
    <div style="padding: 24px 40px; border-top: 1px solid #222; font-size: 12px; color: #555;">
      Unitree Robotics · Paris, France · <a href="{{FRONTEND_URL}}/privacy" style="color: #555;">Politique de confidentialité</a>
    </div>
  </div>
`;

function wrap(content: string): string {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  return BASE.replace('{{CONTENT}}', content).replace('{{FRONTEND_URL}}', frontendUrl);
}

function btn(text: string, href: string): string {
  return `<a href="${href}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">${text}</a>`;
}

export function quoteReceivedCustomer(data: {
  to: string;
  firstName: string;
  quoteNumber: string;
  items: { name: string; quantity: number }[];
}): { to: string; subject: string; html: string } {
  return {
    to: data.to,
    subject: `Votre demande de devis ${data.quoteNumber} a bien été reçue`,
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">Bonjour ${data.firstName},</h2>
      <p>Nous avons bien reçu votre demande de devis <strong>${data.quoteNumber}</strong>.</p>
      <p>Notre équipe commerciale l'étudiera et vous contactera <strong>dans les 48 heures ouvrées</strong>.</p>
      <h3 style="margin-top: 32px; font-size: 16px; color: #aaa;">Produits demandés</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
        ${data.items.map((i) => `
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 8px 0; color: #ddd;">${i.name}</td>
            <td style="padding: 8px 0; text-align: right; color: #aaa;">×${i.quantity}</td>
          </tr>`).join('')}
      </table>
    `),
  };
}

export function quoteReceivedTeam(data: {
  to: string;
  quoteId: string;
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  total: number;
  requestsFinancing?: boolean;
}): { to: string; subject: string; html: string } {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  return {
    to: data.to,
    subject: `[Devis] Nouvelle demande ${data.quoteNumber} — ${data.customerName}`,
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">Nouvelle demande de devis</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #aaa; width: 160px;">Numéro</td><td>${data.quoteNumber}</td></tr>
        <tr><td style="padding: 8px 0; color: #aaa;">Client</td><td>${data.customerName}</td></tr>
        <tr><td style="padding: 8px 0; color: #aaa;">Email</td><td>${data.customerEmail}</td></tr>
        ${data.companyName ? `<tr><td style="padding: 8px 0; color: #aaa;">Entreprise</td><td>${data.companyName}</td></tr>` : ''}
        <tr><td style="padding: 8px 0; color: #aaa;">Total estimé</td><td>€${Number(data.total).toLocaleString('fr-FR')}</td></tr>
        <tr><td style="padding: 8px 0; color: #aaa;">Financement</td><td>${data.requestsFinancing ? '✓ Demandé' : 'Non'}</td></tr>
      </table>
      ${btn('Voir le devis', `${frontendUrl}/admin/quotes/${data.quoteId}`)}
    `),
  };
}

export function quoteSentCustomer(data: {
  to: string;
  firstName: string;
  quoteNumber: string;
  quoteId: string;
  total: number;
  validUntil?: Date | null;
}): { to: string; subject: string; html: string } {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  return {
    to: data.to,
    subject: `Votre devis ${data.quoteNumber} est disponible`,
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">Bonjour ${data.firstName},</h2>
      <p>Votre devis <strong>${data.quoteNumber}</strong> est prêt pour consultation.</p>
      <p>Montant total : <strong>€${Number(data.total).toLocaleString('fr-FR')}</strong></p>
      ${data.validUntil ? `<p style="color: #aaa; font-size: 14px;">Valable jusqu'au ${new Date(data.validUntil).toLocaleDateString('fr-FR')}</p>` : ''}
      ${btn('Consulter mon devis', `${frontendUrl}/devis/${data.quoteId}`)}
    `),
  };
}

export function orderConfirmation(data: {
  to: string;
  firstName: string;
  orderNumber: string;
  total: number;
  items: { name: string; quantity: number; unitPrice: number }[];
}): { to: string; subject: string; html: string } {
  return {
    to: data.to,
    subject: `Confirmation de commande ${data.orderNumber}`,
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">Merci pour votre commande, ${data.firstName} !</h2>
      <p>Votre commande <strong>${data.orderNumber}</strong> a été confirmée.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        ${data.items.map((i) => `
          <tr style="border-bottom: 1px solid #222;">
            <td style="padding: 8px 0; color: #ddd;">${i.name}</td>
            <td style="padding: 8px 0; color: #aaa;">×${i.quantity}</td>
            <td style="padding: 8px 0; text-align: right;">€${(i.unitPrice * i.quantity).toLocaleString('fr-FR')}</td>
          </tr>`).join('')}
        <tr>
          <td colspan="2" style="padding: 12px 0; font-weight: 600;">Total TTC</td>
          <td style="padding: 12px 0; text-align: right; font-weight: 600;">€${Number(data.total).toLocaleString('fr-FR')}</td>
        </tr>
      </table>
    `),
  };
}

export function welcomeEmail(data: {
  email: string;
  firstName: string;
}): { to: string; subject: string; html: string } {
  return {
    to: data.email,
    subject: 'Bienvenue chez Unitree Robotics',
    html: wrap(`
      <h2 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">Bienvenue, ${data.firstName} !</h2>
      <p>Votre compte Unitree Robotics a été créé avec succès.</p>
      <p>Vous pouvez désormais consulter notre catalogue, demander des devis et gérer vos commandes depuis votre espace client.</p>
    `),
  };
}

export const templates = {
  quoteReceivedCustomer,
  quoteReceivedTeam,
  quoteSentCustomer,
  orderConfirmation,
  welcomeEmail,
};
