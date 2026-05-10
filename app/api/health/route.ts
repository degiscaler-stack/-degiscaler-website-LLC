export const runtime = 'nodejs';

export function GET() {
  return Response.json({
    ok: true,
    service: 'degiscaler',
    time: new Date().toISOString(),
  });
}
