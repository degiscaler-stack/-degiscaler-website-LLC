import { useTranslations } from 'next-intl';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function ProblemSolution() {
  const t = useTranslations('home.problemSolution');

  const problems: string[] = t.raw('problems') as string[];
  const solutions: string[] = t.raw('solutions') as string[];

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#FF8411' }}
          >
            {t('problemLabel')}
          </span>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: '#f5f5f5' }}
          >
            {t('headline')}
          </h2>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{ color: '#71717a' }}
          >
            {t('subheadline')}
          </p>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Problems */}
          <div
            className="rounded-xl p-6 lg:p-8"
            style={{
              backgroundColor: '#0d0d0d',
              border: '1px solid #1f1f1f',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <XCircle size={18} style={{ color: '#ef4444' }} />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#ef4444' }}
              >
                {t('problemLabel')}
              </span>
            </div>
            <ul className="space-y-4">
              {problems.map((problem) => (
                <li key={problem} className="flex items-start gap-3">
                  <div
                    className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: '#3f3f46' }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: '#71717a' }}>
                    {problem}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div
            className="rounded-xl p-6 lg:p-8"
            style={{
              backgroundColor: '#0d0d0d',
              border: '1px solid rgba(255,132,17,0.15)',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 size={18} style={{ color: '#FF8411' }} />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#FF8411' }}
              >
                {t('solutionLabel')}
              </span>
            </div>
            <p
              className="text-base font-medium mb-5"
              style={{ color: '#f5f5f5' }}
            >
              {t('solutionHeadline')}
            </p>
            <ul className="space-y-4">
              {solutions.map((solution) => (
                <li key={solution} className="flex items-start gap-3">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: '#FF8411' }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>
                    {solution}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
