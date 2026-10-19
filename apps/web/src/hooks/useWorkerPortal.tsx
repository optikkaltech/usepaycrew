'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkerService, PayoutService } from '@/services';
import { useToast } from './useToast';
import { normalizeError } from '@/utils';

export function useWorker(workerId: string) {
  return useQuery({
    queryKey: ['worker', workerId],
    queryFn: () => WorkerService.getById(workerId),
    enabled: !!workerId,
  });
}

export function useWorkerBalance(workerId: string) {
  return useQuery({
    queryKey: ['workerBalance', workerId],
    queryFn: () => WorkerService.getBalance(),
    enabled: !!workerId,
  });
}

export function useWorkerPayoutMethods(workerId: string) {
  return useQuery({
    queryKey: ['payoutMethods', workerId],
    queryFn: () => PayoutService.getMethods(workerId),
    enabled: !!workerId,
  });
}

export function useMarketRate() {
  return useQuery({
    queryKey: ['marketRate'],
    queryFn: () => WorkerService.getMarketRate(),
    refetchInterval: 30000,
  });
}

export function useWorkerPayments(workerId: string) {
  return useQuery({
    queryKey: ['workerPayments', workerId],
    queryFn: () => WorkerService.getPayments(workerId),
    enabled: !!workerId,
  });
}

export function useUpdateWorkerProfile(workerId: string, onSuccessCallback?: () => void) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name?: string; email?: string; role?: string; country?: string }) =>
      WorkerService.updateProfile(workerId, payload),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['worker', workerId] });
      onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message || 'Failed to update profile');
    },
  });
}

export function useUpdateWorkerPreferences(workerId: string) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (autoCashoutEnabled: boolean) =>
      WorkerService.updatePreferences(workerId, { autoCashoutEnabled }),
    onSuccess: (_data, autoCashoutEnabled) => {
      toast.success(autoCashoutEnabled ? 'Auto-convert enabled' : 'Auto-convert disabled');
      queryClient.invalidateQueries({ queryKey: ['worker', workerId] });
    },
    onError: (err) => {
      toast.error(normalizeError(err).message || 'Failed to update preferences');
    },
  });
}

export function useSetDefaultPayoutMethod(workerId: string, onSuccessCallback?: () => void) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (methodId: string) => PayoutService.setDefaultMethod(methodId),
    onSuccess: () => {
      toast.success('Default account updated');
      queryClient.invalidateQueries({ queryKey: ['payoutMethods', workerId] });
      onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message || 'Failed to update default account');
    },
  });
}

export function useDeletePayoutMethod(workerId: string, onSuccessCallback?: () => void) {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (methodId: string) => PayoutService.deleteMethod(methodId),
    onSuccess: () => {
      toast.success('Bank account removed');
      queryClient.invalidateQueries({ queryKey: ['payoutMethods', workerId] });
      onSuccessCallback?.();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message || 'Failed to remove account');
    },
  });
}
