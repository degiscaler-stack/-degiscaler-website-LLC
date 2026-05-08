type Section = { title: string; content: string };

interface LegalPageProps {
  headline: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
}

export default function LegalPage({
  headline,
  lastUpdated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <div className="pt-24">
      {/* Header */}
      <div
        className="py-14 lg:py-18"
        style={{ backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs mb-3" style={{ color: '#52525b' }}>
            {lastUpdated}
          </p>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold"
            style={{ color: '#f5f5f5' }}
          >
            {headline}
          </h1>
        </div>
      </div>

      <div className="py-14 lg:py-18" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <p className="text-sm leading-relaxed mb-10" style={{ color: '#a1a1aa' }}>
            {intro}
          </p>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i}>
                <h2
                  className="text-base font-semibold mb-3"
                  style={{ color: '#f5f5f5' }}
                >
                  {section.title}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#71717a' }}
                >
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact note */}
          <div
            className="mt-12 p-5 rounded-xl"
            style={{
              backgroundColor: '#0d0d0d',
              border: '1px solid rgba(255,132,17,0.15)',
            }}
          >
            <p className="text-xs" style={{ color: '#71717a' }}>
              <a
                href="mailto:support@degiscaler.com"
                style={{ color: '#FF8411' }}
              >
                support@degiscaler.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
