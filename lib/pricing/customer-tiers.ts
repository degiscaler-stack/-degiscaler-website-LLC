/**
 * Customer plan-type tabs (Personal → Enterprise).
 * Prices stay fixed on each kit card; only the feature list swaps per tab.
 */

export const CUSTOMER_TIERS = [
  'personal',
  'freelancer',
  'agency',
  'enterprise',
] as const;

export type CustomerTier = (typeof CUSTOMER_TIERS)[number];

export const DEFAULT_CUSTOMER_TIER: CustomerTier = 'personal';

export const CUSTOMER_TIER_LABELS: Record<CustomerTier, string> = {
  personal: 'Personal',
  freelancer: 'Freelancer',
  agency: 'Agency',
  enterprise: 'Enterprise',
};

/** Feature lists shown inside every kit card for the active plan type. */
export const TIER_FEATURES: Record<CustomerTier, readonly string[]> = {
  personal: [
    'Personal Website Checklist',
    'Homepage Improvement Guide',
    'Basic Trust Elements',
    'Simple Conversion Tips',
    'PDF Resources',
    'Instant Download',
    'Email Support',
    'Beginner Friendly',
  ],
  freelancer: [
    'Everything in Personal',
    'Client Proposal Templates',
    'Landing Page Optimization',
    'Lead Generation Checklist',
    'SEO Basics Toolkit',
    'Productivity Resources',
    'Business Email Templates',
    'Priority Email Support',
  ],
  agency: [
    'Everything in Freelancer',
    'Team Workflow Templates',
    'Client Onboarding System',
    'Conversion Optimization Toolkit',
    'Sales Funnel Resources',
    'Marketing Audit Documents',
    'Automation Playbooks',
    'Premium Support',
  ],
  enterprise: [
    'Everything in Agency',
    'Complete Business Library',
    'Advanced SOP Collection',
    'Internal Process Templates',
    'Business Growth Framework',
    'Executive Documentation',
    'Premium Resource Vault',
    'VIP Priority Support',
  ],
};

export function isCustomerTier(value: string): value is CustomerTier {
  return (CUSTOMER_TIERS as readonly string[]).includes(value);
}

export function featuresForTier(tier: CustomerTier): readonly string[] {
  return TIER_FEATURES[tier];
}
