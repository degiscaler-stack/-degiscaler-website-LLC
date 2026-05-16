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
  | 'digital_products'
  | 'process'
  | 'contact'
  | 'languages'
  | 'checkout_resources'
  | 'payment_no_guarantee'
  | 'refund'
  | 'timeline';

/** Lower index = breaks ties when multiple intents match */
export const INTENT_PRIORITY: BotIntent[] = [
  'payment_no_guarantee',
  'refund',
  'pricing',
  'services',
  'digital_products',
  'audit',
  'uiux',
  'ecommerce',
  'website_design',
  'landing_page',
  'process',
  'checkout_resources',
  'contact',
  'languages',
  'timeline',
  'company',
];
