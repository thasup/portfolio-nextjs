export function supportsBackdropFilter(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return (
    CSS.supports('backdrop-filter', 'blur(1px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
  );
}
