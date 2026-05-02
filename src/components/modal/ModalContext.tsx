"use client";

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { ModalPayload, ModalContextValue } from "@/types/modal";
import { trackEvent, GA_EVENTS } from "@/lib/analytics";

export const ModalContext = createContext<ModalContextValue | undefined>(
  undefined,
);

import { useHashModal } from "@/hooks/useHashModal";

function HashModalManager() {
  useHashModal();
  return null;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<ModalPayload | null>(null);
  const payloadRef = useRef<ModalPayload | null>(payload);

  useEffect(() => {
    payloadRef.current = payload;
  }, [payload]);

  const open = useCallback((newPayload: ModalPayload) => {
    setPayload(newPayload);
    setIsOpen(true);
    trackEvent(GA_EVENTS.MODAL_OPEN, {
      modal_type: newPayload.type,
      modal_id: newPayload.id,
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Cleanup payload to prevent flashing, but allow exit animation (approx 300ms)
    setTimeout(() => setPayload(null), 300);

    if (payloadRef.current) {
      trackEvent(GA_EVENTS.MODAL_CLOSE, {
        modal_type: payloadRef.current.type,
        modal_id: payloadRef.current.id,
      });
    }
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, payload, open, close }}>
      <HashModalManager />
      {children}
    </ModalContext.Provider>
  );
}
