/**
 * Utilities for masking sensitive customer PII & financial information
 */

export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes('@')) return email || '';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0] || ''}••••@${domain}`;
  }
  return `${local[0]}••••${local[local.length - 1]}@${domain}`;
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const clean = phone.trim();
  if (clean.length < 7) return '•••••••';
  const prefix = clean.startsWith('+') ? clean.slice(0, 4) : clean.slice(0, 3);
  const suffix = clean.slice(-4);
  return `${prefix} ••• ••• ${suffix}`;
}

export function maskAccountNumber(acc: string | null | undefined): string {
  if (!acc) return '';
  const clean = acc.trim();
  if (clean.length <= 4) return '••••';
  const last4 = clean.slice(-4);
  return `•••• •••• ${last4}`;
}

export function maskIdNumber(id: string | null | undefined): string {
  if (!id) return '';
  const clean = id.trim();
  if (clean.length <= 4) return '••••';
  const last4 = clean.slice(-4);
  return `•••••••${last4}`;
}

export function maskWalletAddress(address: string | null | undefined): string {
  if (!address) return '';
  const clean = address.trim();
  if (clean.length <= 10) return clean;
  return `${clean.slice(0, 6)}••••${clean.slice(-4)}`;
}

export function maskAmount(amount: string | number | null | undefined): string {
  if (amount === null || amount === undefined) return '••••••';
  return '••••••••';
}
