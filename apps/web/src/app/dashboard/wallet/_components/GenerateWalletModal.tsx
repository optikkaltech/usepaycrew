'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XIcon, PlusIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';

const AVAILABLE_NETWORKS = [
  'TRON (TRC20)',
  'BNB Chain (BEP20)',
  'Polygon',
  'Base',
  'Ethereum (ERC20)',
];

interface GenerateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingNetworks: string[];
}

export function GenerateWalletModal({
  isOpen,
  onClose,
  existingNetworks,
}: GenerateWalletModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(
    AVAILABLE_NETWORKS.find((n) => !existingNetworks.includes(n)) || AVAILABLE_NETWORKS[0]
  );
  const toast = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: () =>
      http.post('/companies/wallets', {
        currency: 'USDT',
        network: selectedNetwork,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyWallets'] });
      toast.success(`Deposit address generated for ${selectedNetwork}`);
      onClose();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5 text-brand-emerald" />
            <h3 className="text-display-xs text-foreground font-bold">Generate Deposit Address</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 flex flex-col gap-4">
          <p className="text-body-xs text-muted-foreground">
            Select a blockchain network to provision a dedicated live corporate treasury address.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-label-md text-foreground">Blockchain Network</label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="min-h-[44px] rounded-xl border border-border bg-card dark:bg-[#121316] text-foreground px-3 py-2 text-body-md"
            >
              {AVAILABLE_NETWORKS.map((net) => {
                const alreadyHas = existingNetworks.includes(net);
                return (
                  <option key={net} value={net} disabled={alreadyHas} className="bg-card dark:bg-[#121316] text-foreground py-1.5">
                    {net} {alreadyHas ? '(Already Generated)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={generateMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => generateMutation.mutate()}
            isLoading={generateMutation.isPending}
          >
            Generate Address
          </Button>
        </div>
      </div>
    </div>
  );
}
