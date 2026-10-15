import { Injectable, Logger } from '@nestjs/common';
import { env } from '../../config';

export interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ContractorInviteOptions {
  to: string;
  contractorName: string;
  companyName: string;
  role: string;
  payAmount: string;
  payCurrency: string;
  inviteUrl: string;
}

@Injectable()
export class MailerSendProvider {
  private readonly logger = new Logger(MailerSendProvider.name);
  private readonly baseUrl = 'https://api.mailersend.com/v1/email';
  private readonly apiKey = env.MAILERSEND_API_KEY;
  private readonly fromEmail = env.MAILERSEND_FROM_EMAIL;
  private readonly fromName = env.MAILERSEND_FROM_NAME;

  async sendEmail(opts: SendEmailOptions): Promise<boolean> {
    const isMock = !this.apiKey || this.apiKey.startsWith('mlsn.test_');

    if (isMock) {
      this.logger.log(`[MailerSend Simulation] Email to ${opts.to} | Subject: "${opts.subject}"`);
      return true;
    }

    try {
      const resp = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          from: { email: this.fromEmail, name: this.fromName },
          to: [{ email: opts.to, name: opts.toName || opts.to }],
          subject: opts.subject,
          html: opts.html,
          text: opts.text || opts.subject,
        }),
      });

      if (!resp.ok) {
        const errorBody = await resp.text();
        this.logger.warn(`MailerSend error [HTTP ${resp.status}]: ${errorBody}`);
        return false;
      }

      this.logger.log(`MailerSend: Dispatched email to ${opts.to}`);
      return true;
    } catch (err: any) {
      this.logger.error(`MailerSend network failure: ${err.message}`);
      return false;
    }
  }

  async sendContractorInvite(opts: ContractorInviteOptions): Promise<boolean> {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #0c0d11; color: #f4f5f7; border-radius: 16px;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: bold; color: #06D6A0;">PayCrew</span>
        </div>
        <h2 style="font-size: 22px; font-weight: 600; margin-bottom: 16px; color: #ffffff;">You've been invited to join ${opts.companyName}</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #8a8f98; margin-bottom: 24px;">
          Hello ${opts.contractorName},<br/><br/>
          ${opts.companyName} has invited you to receive your monthly compensation for the role of <strong>${opts.role}</strong> (${opts.payAmount} ${opts.payCurrency}) in stablecoins with instant local bank cashout.
        </p>
        <div style="margin: 32px 0;">
          <a href="${opts.inviteUrl}" style="background-color: #06D6A0; color: #000000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
            Accept Invitation &amp; Setup Cashout
          </a>
        </div>
        <p style="font-size: 12px; color: #525866; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px;">
          If the button doesn't work, copy this link into your browser: <br/>${opts.inviteUrl}
        </p>
      </div>
    `;

    return this.sendEmail({
      to: opts.to,
      toName: opts.contractorName,
      subject: `Invitation: Join ${opts.companyName} on PayCrew`,
      html,
      text: `Hello ${opts.contractorName}, ${opts.companyName} invited you to receive payroll on PayCrew. Accept your invite: ${opts.inviteUrl}`,
    });
  }
}
