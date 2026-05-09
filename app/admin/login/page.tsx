import Link from 'next/link';
import { LoginForm } from '@/components/admin/LoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-8 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.85)]">
        <div className="mb-8 text-center">
          <Link
            href="/en"
            className="inline-block bg-gradient-to-r from-[#e8cc65] via-[#d6a700] to-[#ff8411] bg-clip-text text-xl font-semibold tracking-tight text-transparent"
          >
            DegiScaler
          </Link>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-neutral-500">Admin portal</p>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-xs text-neutral-600">
          <Link href="/en" className="text-neutral-400 hover:text-neutral-300">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
