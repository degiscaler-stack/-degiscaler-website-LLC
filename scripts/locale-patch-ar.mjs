import fs from 'fs';

const p = new URL('../messages/ar.json', import.meta.url);
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

Object.assign(j.common, {
  viewServices: 'تصفح الموارد الرقمية',
  getStarted: 'تصفح الأدوات',
  contactUs: 'دعم المنتجات',
  companyName: 'DegiScaler LLC',
});

j.nav.services = 'الموارد';
j.nav.getStarted = 'تصفح الأدوات';

Object.assign(j.footer, {
  tagline: 'موارد رقمية احترافية قابلة للتحميل لأصحاب الأعمال على الإنترنت.',
  digitalDelivery:
    'جميع المنتجات رقمية وقابلة للتحميل. لا يوجد شحن مادي. يتم إرسال الوصول إلكترونياً بعد الشراء.',
  links: { ...j.footer.links, services: 'الموارد' },
  copyright: 'DegiScaler LLC. جميع الحقوق محفوظة.',
  disclaimer:
    'DegiScaler LLC شركة أمريكية تبيع منتجات رقمية. الموارد أدوات تعليمية وعملية؛ لا نضمن نتائج مالية أو مبيعات أو ترتيباً محدداً.',
});

j.home.hero.headline = 'حمّل أدوات رقمية احترافية لتحسين موقعك وبزنسك';
j.home.hero.subheadline =
  'ملفات PDF، قوالب، قوائم تحقق، وأدوات جاهزة تساعد أصحاب المواقع والمتاجر على تحسين الثقة، وضوح العرض، وتجربة الزبون، والتحويلات.';
j.home.hero.ctaPrimary = 'تصفح الأدوات الرقمية';
j.home.hero.ctaSecondary = 'عرض الأسعار';
j.home.hero.trust2 = 'أسعار EUR معلنة';
j.home.hero.trust3 = 'تحميل رقمي';
j.home.hero.trust4 = 'لا ضمانات للنتائج';

fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`);
