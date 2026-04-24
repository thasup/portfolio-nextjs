/**
 * `/learn/not-invited` — legacy page, kept for any stale bookmarks.
 * Redirects to the Google sign-in page.
 */
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function NotInvitedPage() {
  redirect('/learn/login');
}
