ALTER TABLE `packages` MODIFY `currency` VARCHAR(191) NOT NULL DEFAULT 'EUR';

UPDATE `packages`
SET `currency` = 'EUR'
WHERE `currency` = 'USD';
