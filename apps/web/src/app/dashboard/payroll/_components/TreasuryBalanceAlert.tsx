'use client';

import { AppStrings, ShieldAlertIcon, PlusIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils';

interface TreasuryBalanceAlertProps {
  availableBalance: number;
  totalCharged: number;
  onOpenFundModal: () => void;
}

export function TreasuryBalanceAlert({
  availableBalance,
  totalCharged,
  onOpenFundModal,
}: TreasuryBalanceAlertProps) {
  const isInsufficient = availableBalance < totalCharged;
  if (!isInsufficient) return null;

  const shortfall = totalCharged - availableBalance;

  return (
    <Card className="border-destructive/40 bg-destructive/5 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-destructive">
        <ShieldAlertIcon className="h-5 w-5 shrink-0" />
        <span className="text-label-md font-bold">{AppStrings.checkers.insufficientBalance}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-body-xs bg-background/80 rounded-lg p-2.5 border border-border">
        <div>
          <span className="text-caption text-muted-foreground">{AppStrings.checkers.requiredAmount}</span>
          <p className="text-label-md font-bold text-foreground">{formatCurrency(totalCharged, 'USD')}</p>
        </div>
        <div>
          <span className="text-caption text-muted-foreground">{AppStrings.checkers.availableAmount}</span>
          <p className="text-label-md font-bold text-destructive">{formatCurrency(availableBalance, 'USD')}</p>
        </div>
      </div>

      <p className="text-caption text-muted-foreground">
        Shortfall: <span className="font-bold text-destructive">{formatCurrency(shortfall, 'USD')}</span>. Fund your treasury before disbursing.
      </p>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onOpenFundModal}
        className="w-full min-h-[44px] flex items-center justify-center gap-1.5"
      >
        <PlusIcon className="h-4 w-4 text-primary" />
        <span>{AppStrings.checkers.fundTreasuryCta}</span>
      </Button>
    </Card>
  );
}
