import type { BotIntent } from './knowledge';
import { INTENT_PRIORITY } from './knowledge';

type Locale = 'en' | 'ar' | 'fr';

const SUPPORT_PHRASES: Record<Locale | 'all', readonly string[]> = {
  en: [
    'human',
    'real person',
    'talk to someone',
    'talk to a person',
    'talk to team',
    'contact support',
    'support specialist',
    'human support',
    'customer agent',
    'speak to',
    'connect me',
  ],
  ar: [
    'إنسان',
    'شخص حقيقي',
    'موظف',
    'دعم بشري',
    'دعم العملاء',
    'دعم',
    'تحدث مع',
    'تواصل مع أحد',
    'أريد الدعم',
    'حولني للدعم',
    'بغيت الدعم',
    'فريق الدعم',
    'الدعم البشري',
  ],
  fr: [
    'humain',
    'vraie personne',
    'vrai humain',
    'parler à quelqu’un',
    'parler à une personne',
    'agent réel',
    'service client',
    'support client',
    'support humain',
    'besoin d’aide',
    'besoin daide',
    'contacter l’équipe',
    'contacter lequipe',
  ],
  all: [
    'support',
    'customer support',
    'talk to someone',
    'help me',
    'contact',
    'agent',
    'customer service',
    'customer care',
    'representative',
    'دعم',
  ],
};

const KEYWORDS: Record<BotIntent, Record<Locale, readonly string[]> & { all: readonly string[] }> = {
  company: {
    en: ['who are you', 'what is degiscaler', 'about degiscaler', 'company', 'llc'],
    ar: ['من أنتم', 'ما هي', ' عن الشركة ', ' شركة', 'ديغي'],
    fr: ['qui êtes vous', 'quest ce que degiscaler', 'entreprise dégi', 'société degiscaler'],
    all: ['digiscaler', 'digital products', 'digital downloads', 'founders'],
  },
  services: {
    en: ['resources', 'what do you offer', 'templates', 'kits', 'downloads', 'digital products'],
    ar: ['خدمات', 'موارد', 'قوالب', 'تحميل', 'منتجات رقمية'],
    fr: ['ressources', 'modèles', 'kits', 'téléchargements', 'produits numériques'],
    all: [],
  },
  pricing: {
    en: ['price', 'pricing', 'cost', 'how much', 'fee', 'euro', 'eur'],
    ar: ['سعر', 'أسعار', 'تكلفة', 'بكم', 'يورو', 'eur'],
    fr: ['prix', 'tarif', 'tarifs', 'combien', 'eur', 'euro'],
    all: [],
  },
  website_design: {
    en: ['website design', 'web design', 'site design'],
    ar: ['تصميم موقع', 'تصميم الموقع', 'مواقع'],
    fr: ['design de site', 'conception web', 'site web design'],
    all: [],
  },
  ecommerce: {
    en: ['ecommerce', 'e-commerce', 'online store', 'shop', 'store setup'],
    ar: ['تجارة إلكترونية', 'متجر', 'متجر إلكتروني'],
    fr: ['e commerce', 'commerce en ligne', 'boutique en ligne'],
    all: [],
  },
  landing_page: {
    en: ['landing page', 'landing', 'squeeze page'],
    ar: ['صفحة هبوط', 'صفحة واحدة'],
    fr: ["page d'atterrissage", 'landing page'],
    all: [],
  },
  audit: {
    en: ['website audit', 'site audit', 'audit'],
    ar: ['تدقيق', ' مراجعة الموقع', 'مراجعة موقع'],
    fr: ["audit de site", 'audit site web'],
    all: [],
  },
  uiux: {
    en: ['ui ux', 'ui/ux', 'ux review', 'user experience', 'usability'],
    ar: ['واجهة', 'تجربة المستخدم'],
    fr: [' ui ', ' ux ', 'expérience utilisateur'],
    all: [],
  },
  digital_products: {
    en: ['templates', 'downloads', 'pdf', 'checklist', 'notion', 'google sheets', 'zip bundle', 'toolkit'],
    ar: ['قوالب', 'تحميل', 'بي دي اف', 'قائمة تحقق'],
    fr: ['modèles', 'télécharger', 'pdf', 'checklist', 'notion'],
    all: ['digital kit', 'resource bundle'],
  },
  process: {
    en: ['process', 'how it works', 'workflow', 'steps', 'discover'],
    ar: ['كيف تعملون', 'خطوات', 'طريقة العمل', 'مراحل'],
    fr: ['processus', 'étapes', 'comment ça marche', 'fonctionnement'],
    all: ['diagnose', 'deliver', 'build'],
  },
  contact: {
    en: ['email address', 'how to reach', 'reach you', 'write to'],
    ar: ['بريد', 'الإيميل', 'كيف أراسلكم'],
    fr: ['adresse email', 'email de contact', 'vous joindre'],
    all: ['support@', 'degiscaler.com'],
  },
  languages: {
    en: ['languages', 'arabic', 'french', 'english', 'multilingual'],
    ar: ['لغات', 'عربي', 'إنجليزي', 'فرنسي'],
    fr: ['langues', 'anglais', 'arabe', 'français', 'multilingue'],
    all: [],
  },
  checkout_resources: {
    en: ['checkout readiness', 'checkout checklist', 'trust checklist', 'website trust'],
    ar: ['جاهزية الدفع', 'قائمة تحقق الدفع', 'ثقة الموقع'],
    fr: ['préparation checkout', 'checklist de paiement', 'confiance site'],
    all: [],
  },
  payment_no_guarantee: {
    en: ['guarantee results', 'guarantee sales', 'guarantee revenue', 'guarantee ranking'],
    ar: ['ضمان نتائج', 'ضمان مبيعات', 'ضمان أرباح'],
    fr: ['garantir résultats', 'garantir ventes', 'garantir chiffre'],
    all: ['guarantee money', 'promise revenue'],
  },
  refund: {
    en: ['refund', 'money back', 'cancel order', 'chargeback'],
    ar: ['استرداد', 'إرجاع المال', 'استرجاع'],
    fr: ['remboursement', 'rembourser'],
    all: [],
  },
  timeline: {
    en: ['how long', 'response time', 'when will you reply', 'within 48'],
    ar: ['متى الرد', 'مدة الرد', 'وقت الاستجابة'],
    fr: ['délai de réponse', 'combien de temps', 'réponse sous'],
    all: [],
  },
};

export function normalizeUserMessage(raw: string): string {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u0640]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreIntent(msg: string, locale: Locale, intent: BotIntent): number {
  const buckets = KEYWORDS[intent];
  let score = 0;
  const tryMatch = (arr: readonly string[]) => {
    for (const phrase of arr) {
      const p = normalizeUserMessage(phrase);
      if (p.length && msg.includes(p)) score += p.length >= 12 ? 3 : p.length >= 6 ? 2 : 1;
    }
  };
  tryMatch(buckets.all);
  tryMatch(buckets[locale]);
  tryMatch(buckets.en);
  tryMatch(buckets.ar);
  tryMatch(buckets.fr);
  return score;
}

export function shouldStartSupportFlow(msg: string, locale: string): boolean {
  const m = normalizeUserMessage(msg);
  const loc = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr' : 'en';
  const lists = [SUPPORT_PHRASES.all, SUPPORT_PHRASES[loc], SUPPORT_PHRASES.en];
  return lists.some((list) =>
    list.some((phrase) => {
      const p = normalizeUserMessage(phrase);
      return p.length && m.includes(p);
    })
  );
}

export function matchIntent(locale: string, rawMessage: string): BotIntent | null {
  const loc: Locale = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr' : 'en';
  const msg = normalizeUserMessage(rawMessage);
  if (!msg) return null;

  const scores = new Map<BotIntent, number>();
  (Object.keys(KEYWORDS) as BotIntent[]).forEach((intent) => {
    const s = scoreIntent(msg, loc, intent);
    if (s > 0) scores.set(intent, s);
  });

  if (scores.size === 0) return null;

  let best: BotIntent | null = null;
  let bestScore = 0;
  for (const [intent, s] of scores) {
    if (s > bestScore) {
      best = intent;
      bestScore = s;
    } else if (s === bestScore && best) {
      const ra = INTENT_PRIORITY.indexOf(intent);
      const rb = INTENT_PRIORITY.indexOf(best);
      if (ra !== -1 && rb !== -1 && ra < rb) best = intent;
    }
  }
  return best;
}
