export type ModalType = 'project' | 'timeline-event' | 'certificate' | 'testimonial';

export type ModalPayload =
  | { type: 'project'; id: string }
  | { type: 'timeline-event'; id: string }
  | { type: 'certificate'; id: 'aws-ccp' | 'toeic' }
  | { type: 'testimonial'; id: string };

export interface ModalContextValue {
  isOpen: boolean;
  payload: ModalPayload | null;
  open: (payload: ModalPayload) => void;
  close: () => void;
}
