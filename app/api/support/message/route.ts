import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateVisitorMessageBody } from '@/lib/support/public-api';

export const runtime = 'nodejs';

const msgSelect = {
  id: true,
  sender: true,
  body: true,
  attachmentUrl: true,
  attachmentName: true,
  attachmentType: true,
  createdAt: true,
} as const;

export async function POST(request: Request) {
  try {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    }

    const body = json as Record<string, unknown>;
    const parsed = validateVisitorMessageBody({
      sessionId: body.sessionId,
      message: body.message,
      attachmentUrl: body.attachmentUrl,
      attachmentName: body.attachmentName,
      attachmentType: body.attachmentType,
    });

    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const conv = await prisma.supportConversation.findUnique({
      where: { sessionId: parsed.sessionId },
      select: { id: true },
    });

    if (!conv) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    const att = parsed.attachment;

    const msg = await prisma.supportMessage.create({
      data: {
        conversationId: conv.id,
        sender: 'VISITOR',
        body: parsed.message,
        ...(att
          ? {
              attachmentUrl: att.attachmentUrl,
              attachmentName: att.attachmentName,
              attachmentType: att.attachmentType,
            }
          : {}),
      },
      select: msgSelect,
    });

    return NextResponse.json({
      ok: true,
      message: {
        id: msg.id,
        sender: msg.sender,
        body: msg.body,
        attachmentUrl: msg.attachmentUrl ?? undefined,
        attachmentName: msg.attachmentName ?? undefined,
        attachmentType: msg.attachmentType ?? undefined,
        createdAt: msg.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error('[POST /api/support/message]', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
