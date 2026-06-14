import type { Package as DbPkgRow } from '@prisma/client';
import { Package } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAdminDictServer } from '@/lib/admin-i18n/server';
import {
  createPackageAction,
  deletePackageAction,
  updatePackageAction,
} from './actions';

function featLines(features: unknown): string {
  if (Array.isArray(features) && features.every((x) => typeof x === 'string')) {
    return features.join('\n');
  }
  return '';
}

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ deleteBlocked?: string }>;
}) {
  const q = await searchParams;
  const deleteBlocked = q.deleteBlocked === '1';

  const d = await getAdminDictServer();
  let packages: DbPkgRow[] = [];
  let dbError = false;
  try {
    packages = await prisma.package.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  } catch {
    dbError = true;
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--ds-admin-border)] bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600';

  return (
    <div className="space-y-10">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
          <Package className="size-7 text-[var(--ds-admin-accent)]" aria-hidden />
          {d.packagesTitle}
        </h1>
      </div>

      {deleteBlocked ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
        >
          {d.deleteBlocked}
        </div>
      ) : null}

      {dbError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-500/35 bg-amber-950/30 px-4 py-3 text-sm text-amber-100"
        >
          {d.adminDbUnavailable}
        </div>
      ) : null}

      <section className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
        <h2 className="mb-4 text-lg font-medium text-neutral-100">{d.addPackage}</h2>
        <form action={createPackageAction} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-400">{d.slug}</label>
            <input name="slug" required className={inputClass} placeholder="starter-website-kit" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">{d.title}</label>
            <input name="title" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">{d.subtitle}</label>
            <input name="subtitle" className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">{d.priceLabel}</label>
            <input name="price" required className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">{d.currency}</label>
            <input name="currency" defaultValue="EUR" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-400">{d.description}</label>
            <textarea name="description" required rows={4} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-400">{d.featuresLines}</label>
            <textarea name="features" rows={5} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
            <input name="sortOrder" type="number" defaultValue={0} className={inputClass} />
          </div>
          <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input name="isPopular" type="checkbox" className="size-4 rounded border-neutral-600" />
              {d.popular}
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input name="isActive" type="checkbox" defaultChecked className="size-4 rounded border-neutral-600" />
              {d.active}
            </label>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)] hover:bg-[color-mix(in_srgb,var(--ds-admin-accent)_18%,transparent)]"
            >
              {d.create}
            </button>
          </div>
        </form>
      </section>

      {!dbError && packages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--ds-admin-border)] bg-[#0a0a0a]/70 p-12 text-center text-sm text-neutral-500">
          {d.noData}
        </div>
      ) : dbError ? null : (
        <ul className="space-y-6">
          {packages.map((pkg) => (
            <li
              key={pkg.id}
              className="rounded-xl border border-[var(--ds-admin-border)] bg-[#0a0a0a] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]"
            >
              <form action={updatePackageAction} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="id" value={pkg.id} />
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.slug}</label>
                  <input name="slug" required defaultValue={pkg.slug} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.title}</label>
                  <input name="title" required defaultValue={pkg.title} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.subtitle}</label>
                  <input name="subtitle" defaultValue={pkg.subtitle ?? ''} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.priceLabel}</label>
                  <input name="price" required defaultValue={pkg.price} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.currency}</label>
                  <input name="currency" defaultValue={pkg.currency} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.description}</label>
                  <textarea name="description" required rows={4} defaultValue={pkg.description} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.featuresLines}</label>
                  <textarea name="features" rows={5} defaultValue={featLines(pkg.features)} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">{d.sortOrder}</label>
                  <input name="sortOrder" type="number" defaultValue={pkg.sortOrder} className={inputClass} />
                </div>
                <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      name="isPopular"
                      type="checkbox"
                      defaultChecked={pkg.isPopular}
                      className="size-4 rounded border-neutral-600"
                    />
                    {d.popular}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      name="isActive"
                      type="checkbox"
                      defaultChecked={pkg.isActive}
                      className="size-4 rounded border-neutral-600"
                    />
                    {d.active}
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-lg border border-[color-mix(in_srgb,var(--ds-admin-accent)_40%,transparent)] bg-[color-mix(in_srgb,var(--ds-admin-accent)_12%,transparent)] px-4 py-2 text-sm font-medium text-[var(--ds-admin-accent)] hover:bg-[color-mix(in_srgb,var(--ds-admin-accent)_18%,transparent)]"
                  >
                    {d.updatePackage}
                  </button>
                </div>
              </form>
              <div className="mt-4 border-t border-[var(--ds-admin-border)] pt-4">
                <form action={deletePackageAction} className="flex flex-wrap items-center gap-3">
                  <input type="hidden" name="id" value={pkg.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-950/60"
                  >
                    {d.confirmDelete}
                  </button>
                  <span className="text-xs text-neutral-500">{d.deleteBlocked}</span>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
