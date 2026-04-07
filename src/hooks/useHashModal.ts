'use client';

import { useEffect, useRef } from 'react';
import { useModal } from './useModal';

type HashOpenType = 'project' | 'timeline-event' | 'testimonial';

const HASH_MODAL_TYPES: HashOpenType[] = ['project', 'timeline-event', 'testimonial'];

export function useHashModal() {
  const { open, close, isOpen, payload } = useModal();
  const isInternalChange = useRef(false);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        if (isOpenRef.current) close();
        return;
      }

      const firstHyphen = hash.indexOf('-');
      if (firstHyphen === -1) {
        if (isOpenRef.current) close();
        return;
      }

      const typeStr = hash.substring(0, firstHyphen);
      const idStr = hash.substring(firstHyphen + 1);

      if (HASH_MODAL_TYPES.includes(typeStr as HashOpenType)) {
        open({ type: typeStr as HashOpenType, id: idStr });
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [open, close]);

  useEffect(() => {
    if (!payload) {
      if (window.location.hash) {
        isInternalChange.current = true;
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        queueMicrotask(() => {
          isInternalChange.current = false;
        });
      }

      return;
    }

    const targetHash = `#${payload.type}-${payload.id}`;
    if (window.location.hash !== targetHash) {
      isInternalChange.current = true;
      window.history.replaceState(null, '', targetHash);
      queueMicrotask(() => {
        isInternalChange.current = false;
      });
    }
  }, [payload]);
}
