import { LoginForm } from '@/components/admin/LoginForm';
import { LoginFooterLink } from '@/components/admin/LoginFooterLink';
import { LoginHeader } from '@/components/admin/LoginHeader';

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-8 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.85)]">
        <LoginHeader />
        <LoginForm />
        <LoginFooterLink />
      </div>
    </div>
  );
}
