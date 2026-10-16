'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppStrings, XIcon, WalletIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { WalletService, CompanyWallet } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';
import { WalletAddressCard } from './WalletAddressCard';

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundingInfo?: any;
}

const CRYPTO_ASSETS = [
  { id: 'USDT', name: 'USDT', networks: ['TRON (TRC20)', 'Polygon', 'BNB Chain (BEP20)', 'Ethereum (ERC20)'] },
  { id: 'USDC', name: 'USDC', networks: ['Polygon', 'Base', 'Ethereum (ERC20)'] },
  { id: 'BTC', name: 'BTC', networks: ['Bitcoin'] },
  { id: 'ETH', name: 'ETH', networks: ['Ethereum (ERC20)', 'Base', 'Arbitrum'] },
];

export function FundingModal({ isOpen, onClose }: FundingModalProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [selectedAsset, setSelectedAsset] = useState<string>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('TRON (TRC20)');

  const { data: wallets = [], isLoading: isLoadingWallets } = useQuery({
    queryKey: ['companyWallets'],
    queryFn: async () => {
      const res = await WalletService.getWallets();
      return Array.isArray(res) ? res : (res as any)?.data || [];
    },
    enabled: isOpen,
  });

  const createWalletMutation = useMutation({
    mutationFn: (payload: { currency: string; network: string }) =>
      WalletService.createWallet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyWallets'] });
      queryClient.invalidateQueries({ queryKey: ['fundingInfo'] });
      toast.success(`${selectedAsset} (${selectedNetwork}) deposit address created successfully`);
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (!isOpen) return null;

  const currentAssetConfig = CRYPTO_ASSETS.find((a) => a.id === selectedAsset) || CRYPTO_ASSETS[0];

  const handleAssetSelect = (assetId: string) => {
    setSelectedAsset(assetId);
    const config = CRYPTO_ASSETS.find((a) => a.id === assetId);
    if (config && !config.networks.includes(selectedNetwork)) {
      setSelectedNetwork(config.networks[0]);
    }
  };

  const activeWallet = wallets.find(
    (w: CompanyWallet) =>
      w.currency.toUpperCase() === selectedAsset.toUpperCase() &&
      w.network.toLowerCase().includes(selectedNetwork.split(' ')[0].toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5 text-primary">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <WalletIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-label-lg font-bold text-foreground">Fund Company Treasury</h2>
              <p className="text-[11px] text-muted-foreground">Generate live crypto deposit addresses on demand</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary cursor-pointer transition-colors"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Asset Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Cryptocurrency</label>
          <div className="grid grid-cols-4 gap-2">
            {CRYPTO_ASSETS.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => handleAssetSelect(asset.id)}
                className={`py-2 px-3 rounded-xl text-label-sm font-bold border transition-all cursor-pointer text-center ${
                  selectedAsset === asset.id
                    ? 'border-primary bg-primary/10 text-primary shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                }`}
              >
                {asset.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Network Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Network</label>
          <div className="flex flex-wrap gap-2">
            {currentAssetConfig.networks.map((net) => (
              <button
                key={net}
                type="button"
                onClick={() => setSelectedNetwork(net)}
                className={`py-1.5 px-3 rounded-lg text-caption font-semibold border transition-all cursor-pointer ${
                  selectedNetwork === net
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Wallet Address & QR Code Card */}
        <WalletAddressCard
          wallet={activeWallet}
          asset={selectedAsset}
          network={selectedNetwork}
          isGenerating={createWalletMutation.isPending || isLoadingWallets}
          onGenerate={() => createWalletMutation.mutate({ currency: selectedAsset, network: selectedNetwork })}
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border text-[11px] text-muted-foreground">
          <span>Deposits auto-credit after 1 confirmation</span>
          <Button variant="secondary" size="sm" onClick={onClose} className="cursor-pointer">
            {AppStrings.common.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
