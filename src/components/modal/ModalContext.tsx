'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ModalPayload, ModalContextValue } from '@/types/modal';
import { trackEvent, GA_EVENTS } from '@/lib/analytics';

export const ModalContext = createContext<ModalContextValue | undefined>(undefined);

import { useHashModal } from '@/hooks/useHashModal';

function HashModalManager() {
  useHashModal();
  return null;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<ModalPayload | null>(null);

  const open = useCallback((newPayload: ModalPayload) => {
    setPayload(newPayload);
    setIsOpen(true);
    trackEvent(GA_EVENTS.MODAL_OPEN, { 
      modal_type: newPayload.type, 
      modal_id: newPayload.id 
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Cleanup payload to prevent flashing, but allow exit animation (approx 300ms)
    setTimeout(() => setPayload(null), 300); 
    
    if (payload) {
      trackEvent(GA_EVENTS.MODAL_CLOSE, { 
        modal_type: payload.type, 
        modal_id: payload.id 
      });
    }
  }, [payload]);

  return (
    <ModalContext.Provider value={{ isOpen, payload, open, close }}>
      <HashModalManager />
      {children}
    </ModalContext.Provider>
  );
}
