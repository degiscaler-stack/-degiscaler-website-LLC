import { useTranslations } from 'next-intl';

export default function ProcessSection() {
  const t = useTranslations('home.process');
  const steps: { number: string; title: string; description: string }[] =
    t.raw('steps') as { number: string; title: string; description: string }[];

  return (
    <section
      className="py-20 lg:py-28"
      style={{ backgroundColor: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#FF8411' }}
          >
            {t('sectionLabel')}
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold"
            style={{ color: '#f5f5f5' }}
          >
            {t('headline')}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="absolute top-5 start-full w-full h-px hidden lg:block"
                  style={{
                    background:
                      'linear-gradient(to right, #2a2a2a, transparent)',
                    width: 'calc(100% - 2rem)',
                    transform: 'translateX(1rem)',
                  }}
                  aria-hidden="true"
                />
              )}

              <div
                className="rounded-xl p-6 h-full"
                style={{
                  backgroundColor: '#111111',
                  border: '1px solid #1a1a1a',
                }}
              >
                {/* Step number */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: 'rgba(255,132,17,0.2)' }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="text-base font-semibold mb-2"
                  style={{ color: '#f5f5f5' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
