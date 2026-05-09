/** Rule-based intents; answers resolved via next-intl keys `chat.answers.{intent}` */
export type BotIntent =
  | 'company'
  | 'services'
  | 'pricing'
  | 'website_design'
  | 'ecommerce'
  | 'landing_page'
  | 'audit'
  | 'uiux'
  | 'consultation'
  | 'process'
  | 'contact'
  | 'languages'
  | 'payment_readiness'
  | 'payment_no_guarantee'
  | 'refund'
  | 'timeline';

/** Lower index = breaks ties when multiple intents match */
export const INTENT_PRIORITY: BotIntent[] = [
  'payment_no_guarantee',
  'refund',
  'pricing',
  'services',
  'consultation',
  'audit',
  'uiux',
  'ecommerce',
  'website_design',
  'landing_page',
  'process',
  'payment_readiness',
  'contact',
  'languages',
  'timeline',
  'company',
];
