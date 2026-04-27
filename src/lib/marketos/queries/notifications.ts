import 'server-only';
import { prisma } from '@/lib/db/prisma';
import {
  type NotificationDTO,
  type NotificationType,
} from '@/lib/marketos/types';
import type { MarketosNotification } from '@prisma/client';

/**
 * MarketOS — notification reads.
 *
 * Spec: `.windsurf/contexts/marketos-data-flow.md` §3.10, §6.10, §8.10.
 *
 * Notifications are stored on insert (not generated on read). The Inbox
 * page paginates via `read_at + created_at` desc; the sidebar badge
 * reads `countUnread`.
 */

function toNotificationDTO(row: MarketosNotification): NotificationDTO {
  return {
    id: row.id,
    type: row.type as NotificationType,
    title: row.title,
    body: row.body,
    link: row.link,
    read: row.readAt !== null,
    createdAt: row.createdAt.toISOString(),
  };
}

export interface ListNotificationsOptions {
  unreadOnly?: boolean;
  limit?: number;
  /** ISO timestamp; returns notifications strictly older than this. */
  cursor?: string;
}

export async function listNotifications(
  memberId: string,
  options: ListNotificationsOptions = {},
): Promise<NotificationDTO[]> {
  const { unreadOnly = false, limit = 50, cursor } = options;
  const rows = await prisma.marketosNotification.findMany({
    where: {
      memberId,
      ...(unreadOnly ? { readAt: null } : {}),
      ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
  return rows.map(toNotificationDTO);
}

export async function countUnread(memberId: string): Promise<number> {
  return prisma.marketosNotification.count({
    where: { memberId, readAt: null },
  });
}
