'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AppStrings,
  UserPlusIcon,
  UploadIcon,
  SearchIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { AddWorkerModal } from './_components/AddWorkerModal';
import { BulkImportModal } from './_components/BulkImportModal';
import { EditWorkerModal } from './_components/EditWorkerModal';
import { DeleteWorkerModal } from './_components/DeleteWorkerModal';
import { WorkerDirectoryTable } from './_components/WorkerDirectoryTable';

const FILTER_TABS = [
  { id: 'ALL', label: 'All Contractors' },
  { id: 'READY', label: 'Ready for Pay' },
  { id: 'PENDING', label: 'Setup Incomplete' },
];

export default function WorkersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<any | null>(null);
  const [deletingWorker, setDeletingWorker] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toast = useToast();

  const { data: workers = [], refetch } = useQuery({
    queryKey: ['workers'],
    queryFn: () => http.get('/workers'),
  });

  const copyInvite = (token: string, workerId: string) => {
    const inviteUrl = `${window.location.origin}/onboard/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(workerId);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Onboarding link copied to clipboard');
  };

  const filteredWorkers = useMemo(() => {
    return workers.filter((w: any) => {
      const isContractSigned = w.status !== 'INVITED';
      const isKycVerified = w.status === 'ACTIVE' || w.status === 'VERIFIED';
      const isReady = isContractSigned && isKycVerified;

      if (statusFilter === 'READY' && !isReady) return false;
      if (statusFilter === 'PENDING' && isReady) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = w.name?.toLowerCase().includes(q);
        const matchEmail = w.email?.toLowerCase().includes(q);
        const matchRole = w.role?.toLowerCase().includes(q);
        return matchName || matchEmail || matchRole;
      }
      return true;
    });
  }, [workers, statusFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-md text-foreground font-extrabold">{AppStrings.workers.title}</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">Manage remote staff, contracts and payouts</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setBulkModalOpen(true)}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Bulk Import CSV
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <UserPlusIcon className="mr-2 h-4 w-4" />
            {AppStrings.dashboard.addWorker}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          tabs={FILTER_TABS}
          activeTab={statusFilter}
          onChange={setStatusFilter}
        />
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, role or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </div>

      <WorkerDirectoryTable
        workers={filteredWorkers}
        onCopyInvite={copyInvite}
        copiedId={copiedId}
        onAddWorker={() => setModalOpen(true)}
        onEditWorker={setEditingWorker}
        onDeleteWorker={setDeletingWorker}
      />

      <AddWorkerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <BulkImportModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditWorkerModal
        worker={editingWorker}
        isOpen={!!editingWorker}
        onClose={() => setEditingWorker(null)}
        onSuccess={() => refetch()}
      />

      <DeleteWorkerModal
        worker={deletingWorker}
        isOpen={!!deletingWorker}
        onClose={() => setDeletingWorker(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
