'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null;

export function registerToast(fn: (toast: Omit<Toast, 'id'>) => void) {
  toastFn = fn;
}

export function toast(t: Omit<Toast, 'id'>) {
  if (toastFn) toastFn(t);
  else console.log('Toast:', t.title, t.description);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3000);
  }, []);

  return { toasts, toast: addToast };
}
