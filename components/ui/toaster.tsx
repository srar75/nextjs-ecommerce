'use client';

import { useEffect } from 'react';
import { useToast, registerToast } from './use-toast';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts, toast } = useToast();

  useEffect(() => {
    registerToast(toast);
  }, [toast]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-start gap-3 min-w-[280px] max-w-sm rounded-lg border p-4 shadow-lg bg-white animate-in slide-in-from-bottom-2',
            t.variant === 'destructive' && 'border-red-200 bg-red-50'
          )}
        >
          <div className="flex-1">
            <p className="font-semibold text-sm">{t.title}</p>
            {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
