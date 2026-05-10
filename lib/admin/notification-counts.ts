import { prisma } from '@/lib/prisma';

export type AdminSidebarCounts = {
  unseenOrders: number;
  unreadChatConversations: number;
};

const ORDERS_PATH_PREFIX = '/admin/orders';
const CHAT_PATH_PREFIX = '/admin/chat-support';

export async function applyAdminSeenSideEffects(opts: {
  path: string;
  chatThreadId: string | null;
}): Promise<void> {
  const { path, chatThreadId } = opts;

  try {
    if (path === ORDERS_PATH_PREFIX || path.startsWith(`${ORDERS_PATH_PREFIX}/`)) {
      await prisma.order.updateMany({
        where: { adminSeenAt: null },
        data: { adminSeenAt: new Date() },
      });
      return;
    }

    if (
      chatThreadId &&
      (path === CHAT_PATH_PREFIX || path.startsWith(`${CHAT_PATH_PREFIX}/`))
    ) {
      await prisma.supportConversation.updateMany({
        where: { id: chatThreadId },
        data: { adminSeenAt: new Date() },
      });
    }
  } catch (err) {
    console.error('[applyAdminSeenSideEffects]', err);
  }
}

/** Reads pathname + optional chat thread from middleware-injected headers */
export function readAdminRouteFromHeaders(getHeader: (name: string) => string | null): {
  path: string;
  chatThreadId: string | null;
} {
  const path = getHeader('x-ds-admin-path') ?? '';
  const chatThreadIdRaw = getHeader('x-ds-admin-chat-id');
  const chatThreadId = chatThreadIdRaw && chatThreadIdRaw.trim().length ? chatThreadIdRaw.trim() : null;
  return { path, chatThreadId };
}

export async function getAdminSidebarCounts(): Promise<AdminSidebarCounts> {
  try {
    const unseenOrders = await prisma.order.count({
      where: { adminSeenAt: null },
    });

    const conversations = await prisma.supportConversation.findMany({
      where: { status: { not: 'CLOSED' } },
      select: {
        adminSeenAt: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { sender: true, createdAt: true },
        },
      },
    });

    let unreadChatConversations = 0;
    for (const c of conversations) {
      const last = c.messages[0];
      if (!last || last.sender !== 'VISITOR') continue;
      const seenAt = c.adminSeenAt;
      if (!seenAt || seenAt < last.createdAt) unreadChatConversations += 1;
    }

    return { unseenOrders, unreadChatConversations };
  } catch (err) {
    console.error('[getAdminSidebarCounts]', err);
    return { unseenOrders: 0, unreadChatConversations: 0 };
  }
}
