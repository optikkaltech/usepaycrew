'use client';

import { useState, useRef, ChangeEvent } from 'react';
import {
  UploadIcon,
  DownloadIcon,
  CheckCircleIcon,
  XCircleIcon,
  AppStrings,
} from '@/assets';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { WorkerService } from '@/services';
import { useToast } from '@/hooks';
import { PayFrequency } from '@paycrew/shared-types';
import {
  ParsedWorker,
  downloadCsvTemplate,
  parseContractorCsv,
} from './bulk-import.utils';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedRows, setParsedRows] = useState<ParsedWorker[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const rows = parseContractorCsv(content);
      if (rows.length === 0) {
        toast.error('The selected CSV file appears to be empty');
      } else {
        setParsedRows(rows);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error('No valid contractor rows to import');
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;
    for (const row of validRows) {
      try {
        await WorkerService.create({
          name: row.name,
          email: row.email,
          role: row.role,
          payAmount: row.payAmount,
          payCurrency: row.payCurrency,
          payFrequency: PayFrequency.MONTHLY,
        });
        successCount++;
      } catch {
        // Continue with remaining rows
      }
    }

    setIsSubmitting(false);
    toast.success(`Imported and invited ${successCount} contractor(s)`);
    setParsedRows([]);
    onSuccess();
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Import Contractors"
      description="Upload a CSV file to invite multiple international contractors at once."
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
          <div>
            <p className="text-label-md font-semibold text-foreground">Need the formatting standard?</p>
            <p className="text-caption text-muted-foreground">Download our pre-structured CSV template.</p>
          </div>
          <Button variant="outline" size="sm" onClick={downloadCsvTemplate}>
            <DownloadIcon className="h-4 w-4 mr-1.5" />
            Template
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {parsedRows.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-secondary/20 cursor-pointer transition-colors"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <UploadIcon className="h-6 w-6" />
            </div>
            <p className="text-label-md font-semibold text-foreground">Click to select CSV file</p>
            <p className="text-caption text-muted-foreground mt-1">UTF-8 formatted .csv up to 500 contractors</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-body-xs">
              <span className="font-semibold text-foreground">
                Preview: {validCount} valid / {parsedRows.length} total
              </span>
              <button
                type="button"
                onClick={() => setParsedRows([])}
                className="text-primary hover:underline"
              >
                Choose another file
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-border divide-y divide-border">
              {parsedRows.map((r, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 text-body-xs">
                  <div className="flex items-center gap-2">
                    {r.isValid ? (
                      <CheckCircleIcon className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <span className="font-medium text-foreground">{r.name}</span>
                    <span className="text-muted-foreground">({r.email})</span>
                  </div>
                  <div className="text-right">
                    {r.isValid ? (
                      <span className="font-semibold text-foreground">
                        ${r.payAmount} {r.payCurrency}
                      </span>
                    ) : (
                      <span className="text-destructive font-semibold">{r.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {AppStrings.common.cancel}
          </Button>
          <Button
            onClick={handleImport}
            isLoading={isSubmitting}
            disabled={parsedRows.length === 0 || validCount === 0}
          >
            Import &amp; Send Invites ({validCount})
          </Button>
        </div>
      </div>
    </Modal>
  );
}
