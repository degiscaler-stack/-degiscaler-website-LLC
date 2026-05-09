import { useTranslations } from 'next-intl';
import { Building2, Tag, Globe, MessageSquare, CheckSquare } from 'lucide-react';
import { contentMax, ds, iconWellGlyphClass } from './homeTheme';

const items = [
  { key: 'item1', icon: Building2 },
  { key: 'item2', icon: Tag },
  { key: 'item3', icon: Globe },
  { key: 'item4', icon: MessageSquare },
  { key: 'item5', icon: CheckSquare },
] as const;

export default function TrustBar() {
  const t = useTranslations('home.trustBar');

  return (
    <div
      style={{
        backgroundColor: ds.bgAlt,
        backgroundImage:
          'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 40%), linear-gradient(180deg, rgba(255,132,17,0.03), transparent 52%)',
        borderTop: `1px solid ${ds.border}`,
        borderBottom: `1px solid ${ds.border}`,
      }}
    >
      <div className={`px-4 sm:px-6 lg:px-8 py-[52px] md:py-14 xl:py-[3.65rem] ${contentMax}`}>
        <div className="grid auto-rows-fr grid-cols-2 items-stretch gap-x-4 gap-y-5 min-[520px]:grid-cols-2 lg:grid-cols-5 sm:gap-x-6 sm:gap-y-5 lg:gap-x-6 xl:gap-10 [&>div]:min-h-[52px]">
          {items.map(({ key, icon: Icon }) => (
            <div key={key} className="flex min-h-[52px] w-full min-w-0 flex-row items-center gap-3 text-start">
              <div className={`${iconWellGlyphClass} flex h-12 w-12 items-center justify-center rounded-xl border-0`}>
                <Icon size={22} strokeWidth={1.85} style={{ color: ds.iconGold }} aria-hidden />
              </div>
              <span className="min-w-0 flex-1 text-[13px] font-semibold leading-snug sm:text-[14px]" style={{ color: ds.textSecondary }}>
                {t(key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
