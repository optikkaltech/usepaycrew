import { BadRequestException } from '@nestjs/common';
import { Currency } from '@paycrew/shared-types';
import { PaymentFeeEstimate } from './payments.types';

export function calculatePaymentFee(amountStr: string, currency: Currency): PaymentFeeEstimate {
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    throw new BadRequestException('Amount must be greater than zero');
  }
  const feePct = 0.01;
  let fee = amount * feePct;
  const minFee = currency === Currency.NGN ? 500 : 0.5;
  if (fee < minFee) fee = minFee;
  const total = amount + fee;

  return {
    amount: amount.toFixed(2),
    currency,
    feePercentage: 1.0,
    feeAmount: fee.toFixed(2),
    totalCharged: total.toFixed(2),
  };
}
