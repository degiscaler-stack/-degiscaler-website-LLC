/**
 * Homepage tokens — page/cards stay dark; button & icon pigment uses #ff8411 / #d6a700 / #e8cc65 (see globals.css).
 */
export const ds = {
  bgMain: '#050505',
  bgDeep: '#070707',
  bgAlt: '#090909',
  card: '#111214',
  cardElevated: '#15161A',
  text: '#F5F2E9',
  textSecondary: '#B8B3A7',
  textMuted: '#8D887E',
  accent: '#D4AF37',
  accentHover: '#E6C65A',
  accentSoft: '#C9A646',
  accentBright: '#F0D878',
  accentDark: '#8A6F1F',
  iconGold: '#e8cc65',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  accentBorder: 'rgba(212, 175, 55, 0.22)',
  warmIconBorder: 'rgba(232, 204, 101, 0.22)',
  accentBgSoft: 'rgba(212, 175, 55, 0.06)',
  accentBgMedium: 'rgba(212, 175, 55, 0.1)',
  /** Homepage pricing Pro — slightly richer rim vs Starter/Growth (accent triad only) */
  featuredRimGradient:
    'linear-gradient(135deg, rgba(255,132,17,0.68) 0%, rgba(214,167,0,0.55) 45%, rgba(232,204,101,0.52) 100%)',
  /** Starter / Growth — same pigment language, restrained alpha */
  pricingTierRimGradient:
    'linear-gradient(135deg, rgba(255,132,17,0.48) 0%, rgba(214,167,0,0.42) 45%, rgba(232,204,101,0.44) 100%)',
} as const;

export const sectionPad =
  'py-[64px] md:py-[76px] lg:py-[96px] xl:py-[112px]';

export const sectionIntroBottom = 'mb-10 md:mb-14 lg:mb-[4rem]';

export const contentMax = 'max-w-[1200px] mx-auto';

/** Top offset under fixed header — matches homepage hero content */
export const pageMainTopClass =
  'pt-[7rem] sm:pt-[7.125rem] md:pt-[7.375rem] lg:pt-[7.625rem]';

export const sectionTitleClass =
  'text-[1.75rem] sm:text-[2.15rem] md:text-[2.6rem] xl:text-[2.85rem] font-bold tracking-tight leading-[1.1]';

export const accentEyebrowClass = 'text-accent-gradient-eyebrow';
/** Hero eyebrow line — tighter glow on dark masthead only */
export const heroEyebrowClass = `${accentEyebrowClass} hero-accent-eyebrow`;
export const accentStatClass = 'text-accent-gradient-stat';
export const priceFeaturedClass = 'text-price-muted-gold';
export const logoBrandClass = 'logo-brand-word';
export const accentDotMicroClass = 'accent-dot-micro';
export const iconBoxGlyphClass = 'icon-box-premium icon-box-premium--glyph';

export const iconTileClass =
  'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl md:h-[56px] md:w-[56px]';

export const primaryBtnClass =
  'btn-primary-premium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0';

export const primaryBtnStrongClass =
  'btn-primary-premium btn-primary-premium--strong transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0';

export const secondaryBtnClass =
  'btn-secondary-premium transition-all duration-200 hover:-translate-y-0.5';

/** Homepage pricing tier CTAs (Starter / Growth) */
export const pricingCardSecondaryBtnClass =
  'btn-pricing-card-secondary transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0';

/** Apply with icon wells on homepage pricing feature rows */
export const iconPricingWellClass = 'icon-pricing-well';

/** Shared rule line inside homepage pricing cards */
export const pricingCardDividerClass = 'pricing-card-divider';

export const iconBoxClass = 'icon-box-premium';

export const iconBoxSmClass = 'icon-box-premium icon-box-premium--sm';

/** Full-size + small icon wells with premium gradient rim */
export const iconWellGlyphClass = iconBoxGlyphClass;
export const iconWellSmGlyphClass = `${iconBoxSmClass} icon-box-premium--glyph`;

/** Parity with .btn-primary-premium (no dark stops in pigment layers) */
export const primaryBtnBgFallback = [
  'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(156, 107, 22, 0.09) 100%)',
  'linear-gradient(118deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.02) 45%, rgba(255, 255, 255, 0.09) 100%)',
  'linear-gradient(135deg, #ff8411 0%, #d6a700 48%, #e8cc65 100%)',
].join(', ');

export const primaryBtnShadowFallback =
  '0 10px 28px rgba(255, 132, 17, 0.18), 0 0 24px rgba(232, 204, 101, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.22)';

/** @deprecated Use `iconBoxClass` + globals `.icon-box-premium` */
export const iconTileBgImage = '';

export const cardSurfaceBgImage =
  'linear-gradient(145deg, #15161A 0%, #101113 48%, #0B0B0C 100%)';

export const cardTopHighlight = 'inset 0 1px 0 rgba(255,255,255,0.056)';
