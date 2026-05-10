import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateVisitorMessageBody } from '@/lib/support/public-api';

export const runtime = 'nodejs';

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

    const msg = await prisma.supportMessage.create({
      data: {
        conversationId: conv.id,
        sender: 'VISITOR',
        body: parsed.message,
      },
      select: { id: true, sender: true, body: true, createdAt: true },
    });

    return NextResponse.json({
      ok: true,
      message: {
        id: msg.id,
        sender: msg.sender,
        body: msg.body,
        createdAt: msg.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error('[POST /api/support/message]', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
