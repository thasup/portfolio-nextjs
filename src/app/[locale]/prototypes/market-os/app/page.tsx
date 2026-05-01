import { redirect } from 'next/navigation';

/**
 * `/prototypes/market-os/app` redirects to the dashboard. The bare
 * `/app` segment is just an organisational anchor for the URL, never
 * a destination.
 */
export default function AppIndex() {
  redirect('/prototypes/market-os/app/dashboard');
}
