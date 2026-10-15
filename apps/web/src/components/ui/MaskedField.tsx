'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from '@/assets';
import {
  maskEmail,
  maskPhone,
  maskAccountNumber,
  maskIdNumber,
  maskWalletAddress,
  maskAmount,
} from '@/utils';

export type MaskType = 'email' | 'phone' | 'account' | 'id' | 'wallet' | 'amount' | 'generic';

interface MaskedFieldProps {
  value: string;
  type?: MaskType;
  allowReveal?: boolean;
  allowCopy?: boolean;
  className?: string;
  maskedValue?: string;
}

export function MaskedField({
  value,
  type = 'generic',
  allowReveal = false,
  allowCopy = false,
  className = '',
  maskedValue: customMasked,
}: MaskedFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getMaskedDisplay = (): string => {
    if (customMasked) return customMasked;
    if (!value) return '';
    switch (type) {
      case 'email':
        return maskEmail(value);
      case 'phone':
        return maskPhone(value);
      case 'account':
        return maskAccountNumber(value);
      case 'id':
        return maskIdNumber(value);
      case 'wallet':
        return maskWalletAddress(value);
      case 'amount':
        return maskAmount(value);
      default:
        return value.length > 4 ? `•••• ${value.slice(-4)}` : '••••';
    }
  };

  const displayText = isRevealed ? value : getMaskedDisplay();

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-body-xs ${className}`}>
      <span className="select-all tracking-wider">{displayText}</span>

      {allowReveal && (
        <button
          type="button"
          onClick={() => setIsRevealed((prev) => !prev)}
          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
          aria-label={isRevealed ? 'Hide sensitive data' : 'Reveal sensitive data'}
        >
          {isRevealed ? <EyeOffIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
        </button>
      )}

      {allowCopy && value && (
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Copy value"
        >
          {isCopied ? (
            <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </span>
  );
}
