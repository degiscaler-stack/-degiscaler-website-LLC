import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { validateSupportCreateBody } from '@/lib/support/public-api';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId')?.trim();
    if (!sessionId) {
      return NextResponse.json({ ok: false, error: 'session_required' }, { status: 400 });
    }

    const conv = await prisma.supportConversation.findUnique({
      where: { sessionId },
      select: {
        id: true,
        sessionId: true,
        status: true,
        locale: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          where: { sender: { in: ['VISITOR', 'ADMIN'] } },
          select: msgSelect,
        },
      },
    });

    if (!conv) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    const messages = conv.messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      body: m.body,
      attachmentUrl: m.attachmentUrl ?? undefined,
      attachmentName: m.attachmentName ?? undefined,
      attachmentType: m.attachmentType ?? undefined,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json({
      ok: true,
      conversationId: conv.id,
      sessionId: conv.sessionId,
      status: conv.status,
      locale: conv.locale,
      messages,
    });
  } catch (err) {
    console.error('[GET /api/support/conversation]', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    }

    const body = json as Record<string, unknown>;
    const parsed = validateSupportCreateBody({
      sessionId: body.sessionId,
      fullName: body.fullName,
      email: body.email,
      whatsapp: body.whatsapp,
      message: body.message,
      locale: body.locale,
      attachmentUrl: body.attachmentUrl,
      attachmentName: body.attachmentName,
      attachmentType: body.attachmentType,
    });

    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const sid = parsed.sessionId ?? randomUUID();
    const att = parsed.attachment;

    const msgData = {
      sender: 'VISITOR' as const,
      body: parsed.message,
      ...(att
        ? {
            attachmentUrl: att.attachmentUrl,
            attachmentName: att.attachmentName,
            attachmentType: att.attachmentType,
          }
        : {}),
    };

    const existing = await prisma.supportConversation.findUnique({
      where: { sessionId: sid },
    });

    if (existing) {
      await prisma.supportConversation.update({
        where: { id: existing.id },
        data: {
          fullName: parsed.fullName,
          email: parsed.email,
          whatsapp: parsed.whatsapp,
          locale: parsed.locale,
          status: existing.status === 'CLOSED' ? 'OPEN' : existing.status,
        },
      });
      await prisma.supportMessage.create({
        data: {
          conversationId: existing.id,
          ...msgData,
        },
      });
      const messages = await prisma.supportMessage.findMany({
        where: { conversationId: existing.id },
        orderBy: { createdAt: 'asc' },
        select: msgSelect,
      });

      return NextResponse.json({
        ok: true,
        sessionId: sid,
        conversationId: existing.id,
        messages: messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          body: m.body,
          attachmentUrl: m.attachmentUrl ?? undefined,
          attachmentName: m.attachmentName ?? undefined,
          attachmentType: m.attachmentType ?? undefined,
          createdAt: m.createdAt.toISOString(),
        })),
      });
    }

    const conv = await prisma.supportConversation.create({
      data: {
        sessionId: sid,
        fullName: parsed.fullName,
        email: parsed.email,
        whatsapp: parsed.whatsapp,
        locale: parsed.locale,
        status: 'OPEN',
      },
    });

    await prisma.supportMessage.create({
      data: {
        conversationId: conv.id,
        ...msgData,
      },
    });

    const messages = await prisma.supportMessage.findMany({
      where: { conversationId: conv.id },
      orderBy: { createdAt: 'asc' },
      select: msgSelect,
    });

    return NextResponse.json({
      ok: true,
      sessionId: sid,
      conversationId: conv.id,
      messages: messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        body: m.body,
        attachmentUrl: m.attachmentUrl ?? undefined,
        attachmentName: m.attachmentName ?? undefined,
        attachmentType: m.attachmentType ?? undefined,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error('[POST /api/support/conversation]', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
