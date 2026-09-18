'use client';

import {
  FileDown,
  FileText,
  Copy,
  Check,
  Share2,
} from 'lucide-react';
import { useState } from 'react';
import type { SplitResult } from '@/lib/split';
import {
  generateCSV,
  generateInvoiceText,
  downloadFile,
  generateShareLink,
} from '@/lib/export';
import { cn } from '@/lib/utils';

interface ExportButtonsProps {
  result: SplitResult;
  amount: number;
  mode: string;
  modeLabel: string;
}

export function ExportButtons({
  result,
  amount,
  mode,
  modeLabel,
}: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCSV = () => {
    const csv = generateCSV(result);
    downloadFile(csv, 'splitcart-schedule.csv', 'text/csv');
  };

  const handlePDF = () => {
    const text = generateInvoiceText(result, amount, mode, modeLabel);
    const html = `<pre style="font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6; padding: 40px; color: #1a1a2e;">${text}</pre>`;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.title = 'SplitCart Payment Schedule';
      win.document.close();
      setTimeout(() => win.print(), 300);
    }
  };

  const handleCopyLink = async () => {
    const link = generateShareLink(amount, mode, mode === 'chunk' ? 0 : 0);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSummary = () => {
    const text = generateInvoiceText(result, amount, mode, modeLabel);
    downloadFile(text, 'splitcart-invoice.txt', 'text/plain');
  };

  const buttons = [
    {
      label: 'Summary',
      icon: <FileText className="h-4 w-4" />,
      onClick: handleSummary,
      variant: 'default' as const,
    },
    {
      label: 'CSV',
      icon: <FileDown className="h-4 w-4" />,
      onClick: handleCSV,
      variant: 'outline' as const,
    },
    {
      label: 'PDF',
      icon: <FileDown className="h-4 w-4" />,
      onClick: handlePDF,
      variant: 'outline' as const,
    },
    {
      label: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />,
      onClick: handleCopyLink,
      variant: copied ? 'default' : 'outline' as const,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
            btn.variant === 'default'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'border border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary'
          )}
        >
          {btn.icon}
          {btn.label}
        </button>
      ))}
      <div className="hidden items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground sm:flex">
        <Share2 className="h-3.5 w-3.5" />
        Share or export schedule
      </div>
    </div>
  );
}
