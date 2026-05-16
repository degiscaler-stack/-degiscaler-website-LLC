-- Rename primary package slugs to marketing-facing identifiers (legacy aliases remain in app code).
UPDATE `packages` SET `slug` = 'starter-website-kit' WHERE `slug` = 'starter-consultation';
UPDATE `packages` SET `slug` = 'growth-optimization-kit' WHERE `slug` = 'growth-consultation';
UPDATE `packages` SET `slug` = 'pro-conversion-toolkit' WHERE `slug` = 'pro-consultation';
UPDATE `packages` SET `slug` = 'scale-business-bundle' WHERE `slug` = 'scale-consultation';
