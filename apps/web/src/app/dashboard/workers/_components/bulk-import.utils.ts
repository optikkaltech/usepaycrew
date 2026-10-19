import { Currency } from '@paycrew/shared-types';

export interface ParsedWorker {
  name: string;
  email: string;
  role: string;
  payAmount: string;
  payCurrency: Currency;
  isValid: boolean;
  error?: string;
}

export const CSV_SAMPLE =
  'name,email,role,payAmount,payCurrency\nChidi Obi,chidi@contractor.io,Backend Engineer,3500.00,USD\nAmina Bello,amina@contractor.io,UI/UX Designer,2800.00,USD\nKwame Mensah,kwame@contractor.io,DevOps Engineer,4200.00,USD';

export function downloadCsvTemplate() {
  const blob = new Blob([CSV_SAMPLE], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'paycrew_contractors_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseContractorCsv(text: string): ParsedWorker[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const rows: ParsedWorker[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
    const [name, email, role, payAmount, cur] = cols;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    const isValidAmount = /^\d+(\.\d{1,2})?$/.test(payAmount || '');
    const payCurrency = cur?.toUpperCase() === 'NGN' ? Currency.NGN : Currency.USD;

    let error: string | undefined;
    if (!name || name.length < 2) error = 'Missing name';
    else if (!isValidEmail) error = 'Invalid email';
    else if (!role) error = 'Missing role';
    else if (!isValidAmount) error = 'Invalid amount';

    rows.push({
      name: name || '',
      email: email || '',
      role: role || 'Contractor',
      payAmount: payAmount || '0.00',
      payCurrency,
      isValid: !error,
      error,
    });
  }
  return rows;
}
