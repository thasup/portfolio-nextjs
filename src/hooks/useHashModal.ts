'use client';

import { useEffect, useRef } from 'react';
import { useModal } from './useModal';

export function useHashModal() {
  const { open, close, isOpen, payload } = useModal();
  const isInternalChange = useRef(false);

  useEffect(() => {
    const handleHashChange = () => {
      // Prevent cyclical updates if we intentionally pushed a state
      if (isInternalChange.current) {
        isInternalChange.current = false;
        return;
      }

      const hash = window.location.hash.slice(1);
      if (!hash) {
        if (isOpen) close();
        return;
      }

      const firstHyphen = hash.indexOf('-');
      if (firstHyphen === -1) {
        if (isOpen) close();
        return;
      }

      const typeStr = hash.substring(0, firstHyphen);
      const idStr = hash.substring(firstHyphen + 1);

      if (['project', 'timeline-event', 'certificate', 'testimonial'].includes(typeStr)) {
        open({ type: typeStr as any, id: idStr });
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [open, close, isOpen]);

  // Sync state changes back to URL if modal closes
  useEffect(() => {
    if (!isOpen && window.location.hash) {
      const hash = window.location.hash.slice(1);
      const firstHyphen = hash.indexOf('-');
      if (firstHyphen !== -1) {
        const typeStr = hash.substring(0, firstHyphen);
        if (['project', 'timeline-event', 'certificate', 'testimonial'].includes(typeStr)) {
          isInternalChange.current = true;
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }
      }
    } else if (isOpen && payload) {
      const targetHash = `#${payload.type}-${payload.id}`;
      if (window.location.hash !== targetHash) {
        isInternalChange.current = true;
        window.history.pushState(null, '', targetHash);
      }
    }
  }, [isOpen, payload]);
}
