import { Currency, LedgerCategory, LedgerEntryType } from '@paycrew/shared-types';

describe('Financial & Business-Critical Operations Math', () => {
  describe('Double-Entry Ledger Math & Balance Derivation', () => {
    it('computes net available balance accurately without floating point drift', () => {
      const entries = [
        { amount: '1000.00', entryType: LedgerEntryType.CREDIT }, // Deposit
        { amount: '250.50', entryType: LedgerEntryType.DEBIT },   // Payroll
        { amount: '2.51', entryType: LedgerEntryType.DEBIT },     // Fee
        { amount: '100.00', entryType: LedgerEntryType.CREDIT },  // Refund
      ];

      let creditsInCents = 0;
      let debitsInCents = 0;

      for (const entry of entries) {
        const val = Math.round(parseFloat(entry.amount) * 100);
        if (entry.entryType === LedgerEntryType.CREDIT) creditsInCents += val;
        if (entry.entryType === LedgerEntryType.DEBIT) debitsInCents += val;
      }

      const netCents = creditsInCents - debitsInCents;
      const availableBalance = (netCents / 100).toFixed(2);

      expect(creditsInCents).toBe(110000);
      expect(debitsInCents).toBe(25301);
      expect(availableBalance).toBe('846.99');
    });

    it('rejects payroll if company available balance is less than amount + fee', () => {
      const availableBalance = 500.00;
      const requestedAmount = 500.00;
      const fee = 5.00;
      const totalRequired = requestedAmount + fee;

      const isSufficient = availableBalance >= totalRequired;
      expect(isSufficient).toBe(false);
    });
  });

  describe('Payroll Fee Calculations (PRD Section 7)', () => {
    const calculateFee = (amount: number, currency: Currency) => {
      const feePct = 0.01;
      let fee = amount * feePct;
      const minFee = currency === Currency.NGN ? 500 : 0.5;
      if (fee < minFee) fee = minFee;
      return {
        amount,
        fee: parseFloat(fee.toFixed(2)),
        total: parseFloat((amount + fee).toFixed(2)),
      };
    };

    it('applies 1% fee on standard amounts', () => {
      const result = calculateFee(2000, Currency.USD);
      expect(result.fee).toBe(20.00);
      expect(result.total).toBe(2020.00);
    });

    it('enforces min ₦500 fee on small naira payroll', () => {
      const result = calculateFee(10000, Currency.NGN); // 1% of 10,000 is 100, but min is 500
      expect(result.fee).toBe(500.00);
      expect(result.total).toBe(10500.00);
    });

    it('enforces min $0.50 fee on small USD payroll', () => {
      const result = calculateFee(20, Currency.USD); // 1% of 20 is 0.20, but min is 0.50
      expect(result.fee).toBe(0.50);
      expect(result.total).toBe(20.50);
    });
  });

  describe('Statutory Stamp Duty & Worker Naira Withdrawal (PRD Section 11)', () => {
    const calculateWithdrawal = (grossNgn: number) => {
      const partnerFee = 150.0;
      const flatFee = 100.0;
      const stampDuty = grossNgn >= 10000 ? 50.0 : 0.0;
      const totalDeductions = partnerFee + flatFee + stampDuty;
      const netPayoutNaira = grossNgn - totalDeductions;
      return {
        partnerFee,
        flatFee,
        stampDuty,
        totalDeductions,
        netPayoutNaira,
      };
    };

    it('applies statutory ₦50 stamp duty on withdrawal of ₦10,000 or above', () => {
      const result = calculateWithdrawal(50000);
      expect(result.stampDuty).toBe(50.0);
      expect(result.totalDeductions).toBe(300.0); // 150 + 100 + 50
      expect(result.netPayoutNaira).toBe(49700.0);
    });

    it('exempts statutory stamp duty on withdrawal below ₦10,000', () => {
      const result = calculateWithdrawal(8000);
      expect(result.stampDuty).toBe(0.0);
      expect(result.totalDeductions).toBe(250.0); // 150 + 100
      expect(result.netPayoutNaira).toBe(7750.0);
    });
  });
});
