-- WhatsApp field + nullable message for optional inquiry body
ALTER TABLE `contact_messages` ADD COLUMN `whatsapp` VARCHAR(191) NULL;
ALTER TABLE `contact_messages` MODIFY COLUMN `message` TEXT NULL;
