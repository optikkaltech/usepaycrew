'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BuildingIcon } from '@/assets';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { http } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';

interface CompanyProfileSectionProps {
  company?: any;
}

export function CompanyProfileSection({ company }: CompanyProfileSectionProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [country, setCountry] = useState('Nigeria');

  useEffect(() => {
    if (company) {
      setCompanyName(company.name || '');
      setCountry(company.country === 'NG' ? 'Nigeria' : company.country || 'Nigeria');
      setWebsite(company.website || `${company.name ? company.name.toLowerCase().replace(/\s+/g, '') : 'company'}.io`);
      setContactEmail(company.contactEmail || `payroll@${company.name ? company.name.toLowerCase().replace(/\s+/g, '') : 'company'}.io`);
    }
  }, [company]);

  const updateMutation = useMutation({
    mutationFn: () =>
      http.patch('/companies/current', {
        name: companyName,
        country: country === 'Nigeria' ? 'NG' : country,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyInfo'] });
      toast.success('Company profile updated successfully');
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  return (
    <Card variant="elevated" className="flex flex-col gap-6 border-border p-6 sm:p-8">
      <div>
        <h2 className="text-display-xs text-foreground font-bold">Company profile</h2>
        <p className="mt-1 text-body-xs text-muted-foreground">
          This information appears on invoices and receipts.
        </p>
      </div>

      {/* Logo & Change Logo Button */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-emerald text-black shadow-sm">
          <BuildingIcon className="h-7 w-7" />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => toast.info('Logo upload dialog')}
        >
          Change logo
        </Button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Acme Inc."
        />

        <Input
          label="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="acme.io"
        />

        <Input
          label="Contact email"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="payroll@acme.io"
        />

        <Input
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Nigeria"
        />
      </div>

      {/* Save Changes CTA */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => updateMutation.mutate()}
          isLoading={updateMutation.isPending}
        >
          Save changes
        </Button>
      </div>
    </Card>
  );
}
