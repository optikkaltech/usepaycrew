'use client';

import { useState, useEffect } from 'react';
import { useToast, useUpdateWorkerProfile } from '@/hooks';
import { Button } from '@/components/ui/Button';

interface SettingsProfilePanelProps {
  workerId: string;
  worker: any;
  onSuccess: () => void;
}

export function SettingsProfilePanel({ workerId, worker, onSuccess }: SettingsProfilePanelProps) {
  const toast = useToast();
  const [name, setName] = useState(worker?.name || '');
  const [email, setEmail] = useState(worker?.email || '');
  const [role, setRole] = useState(worker?.role || '');
  const [country, setCountry] = useState(worker?.country || 'Nigeria');

  const updateProfileMutation = useUpdateWorkerProfile(workerId, onSuccess);
  const isSaving = updateProfileMutation.isPending;

  useEffect(() => {
    if (worker) {
      if (worker.name) setName(worker.name);
      if (worker.email) setEmail(worker.email);
      if (worker.role) setRole(worker.role);
      if (worker.country) setCountry(worker.country);
    }
  }, [worker]);

  const getInitials = (fullName: string) => {
    if (!fullName) return 'AO';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ name, email, role, country });
  };

  return (
    <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-6 sm:p-8 flex-1">
      <div className="mb-6">
        <h2 className="text-display-xs font-bold text-foreground">Profile</h2>
        <p className="text-body-xs text-muted-foreground mt-0.5">
          Your details as shown to employers.
        </p>
      </div>

      {/* Avatar Row */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-body-lg shadow-xs shrink-0">
          {getInitials(name || worker?.name)}
        </div>
        <button
          type="button"
          onClick={() => toast.info('Photo upload available soon')}
          className="border border-primary/30 text-primary hover:bg-primary/5 px-4 py-2 rounded-xl text-body-xs font-semibold transition-colors cursor-pointer"
        >
          Change photo
        </button>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-body-xs font-medium text-foreground">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adaeze Okonkwo"
              className="h-11 rounded-xl border border-input bg-background px-3.5 text-body-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-xs font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. adaeze@team.io"
              className="h-11 rounded-xl border border-input bg-background px-3.5 text-body-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-xs font-medium text-foreground">
              Role / title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="h-11 rounded-xl border border-input bg-background px-3.5 text-body-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-body-xs font-medium text-foreground">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Nigeria"
              className="h-11 rounded-xl border border-input bg-background px-3.5 text-body-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="min-h-[44px] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
