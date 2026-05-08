import { useTranslations } from 'next-intl';
import { Building2, DollarSign, Globe, MessageSquare, CheckCircle } from 'lucide-react';

const items = [
  { key: 'item1', icon: Building2 },
  { key: 'item2', icon: DollarSign },
  { key: 'item3', icon: Globe },
  { key: 'item4', icon: MessageSquare },
  { key: 'item5', icon: CheckCircle },
] as const;

export default function TrustBar() {
  const t = useTranslations('home.trustBar');

  return (
    <div
      className="py-5"
      style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map(({ key, icon: Icon }, i) => (
            <div key={key} className="flex items-center gap-2">
              {i > 0 && (
                <div
                  className="w-px h-4 hidden sm:block"
                  style={{ backgroundColor: '#2a2a2a' }}
                  aria-hidden="true"
                />
              )}
              <Icon size={14} style={{ color: '#FF8411' }} />
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: '#71717a' }}
              >
                {t(key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
