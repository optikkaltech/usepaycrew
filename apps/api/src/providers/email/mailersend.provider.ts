import { Injectable, Logger } from '@nestjs/common';
import { env } from '../../config';
import { buildContractorInviteHtml, ContractorInviteEmailProps } from './contractor-invite.template';

export interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface ContractorInviteOptions extends ContractorInviteEmailProps {
  to: string;
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
    const html = buildContractorInviteHtml(opts);
    const expiresIn = opts.expiresIn || '7 days';

    return this.sendEmail({
      to: opts.to,
      toName: opts.contractorName,
      subject: `Invitation: Join ${opts.companyName} on PayCrew`,
      html,
      text: `Hello ${opts.contractorName}, ${opts.companyName} invited you to receive payroll on PayCrew. This link expires in ${expiresIn}. Accept your invite: ${opts.inviteUrl}`,
    });
  }
}
