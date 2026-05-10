ALTER TABLE `support_messages`
    ADD COLUMN `attachmentUrl` LONGTEXT NULL,
    ADD COLUMN `attachmentName` VARCHAR(191) NULL,
    ADD COLUMN `attachmentType` VARCHAR(191) NULL;
