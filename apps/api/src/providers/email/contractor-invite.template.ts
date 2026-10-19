export interface ContractorInviteEmailProps {
  contractorName: string;
  companyName: string;
  role: string;
  payAmount: string;
  payCurrency: string;
  payFrequency?: string;
  inviteUrl: string;
  expiresIn?: string;
}

export function buildContractorInviteHtml(props: ContractorInviteEmailProps): string {
  const {
    contractorName,
    companyName,
    role,
    payAmount,
    payCurrency,
    payFrequency,
    inviteUrl,
    expiresIn = '7 days',
  } = props;

  const frequencyLabel = payFrequency ? ` • ${payFrequency.toLowerCase()}` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've been invited to join ${companyName} on PayCrew</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; background-color: transparent;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px 28px; border-collapse: separate; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <!-- Header -->
          <tr>
            <td>
              <table role="presentation" width="100%">
                <tr>
                  <td align="left">
                    <div style="display: inline-flex; align-items: center; gap: 8px;">
                      <span style="display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; background-color: #06D6A0; color: #000000; font-weight: 900; font-size: 14px; border-radius: 6px;">P</span>
                      <span style="font-size: 18px; font-weight: 700; color: #0f172a; margin-left: 6px; letter-spacing: -0.3px;">PayCrew</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="background-color: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">Invitation</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Heading -->
          <tr>
            <td style="padding-top: 24px;">
              <h1 style="font-size: 21px; font-weight: 700; color: #0f172a; margin: 0 0 14px 0; line-height: 1.35; letter-spacing: -0.2px;">
                You've been invited to join ${companyName}
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Hello <strong>${contractorName}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                <strong>${companyName}</strong> has invited you to receive your contractor payroll on PayCrew. Once your account is set up, disbursements will be issued in stablecoins with instant automated cashout directly to your local bank account.
              </p>
            </td>
          </tr>

          <!-- Summary Box -->
          <tr>
            <td>
              <table role="presentation" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; border-collapse: separate;">
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Role</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${role}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Compensation</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${payAmount} ${payCurrency}${frequencyLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Payout Option</td>
                  <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #059669;">Instant Bank Transfer / USDT</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td align="center" style="padding: 8px 0 24px 0;">
              <a href="${inviteUrl}" target="_blank" style="display: inline-block; background-color: #06D6A0; color: #022c22; padding: 13px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none; box-shadow: 0 2px 6px rgba(6, 214, 160, 0.35); text-align: center;">
                Accept Invitation &amp; Setup Cashout
              </a>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td>
              <table role="presentation" width="100%" style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; padding: 12px 14px; margin-bottom: 24px; border-collapse: separate;">
                <tr>
                  <td style="font-size: 12px; line-height: 1.5; color: #92400e;">
                    ⏳ <strong>Link Expiry:</strong> This secure invitation link will expire in <strong>${expiresIn}</strong>. Please complete your registration before the link expires.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Direct Link Fallback -->
          <tr>
            <td style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <p style="font-size: 12px; line-height: 1.6; color: #64748b; margin: 0 0 6px 0;">
                If the button above doesn't work, copy and paste this URL into your browser:
              </p>
              <a href="${inviteUrl}" style="font-size: 11px; line-height: 1.5; color: #059669; word-break: break-all; text-decoration: underline;">
                ${inviteUrl}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 20px; text-align: center;">
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 4px 0;">
                PayCrew • Borderless Automated Payroll &amp; Contractor Infrastructure
              </p>
              <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
                This email was intended for ${contractorName}. If you received this in error, you can safely disregard it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
