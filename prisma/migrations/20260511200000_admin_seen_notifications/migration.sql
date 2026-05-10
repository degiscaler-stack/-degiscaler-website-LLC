ALTER TABLE `orders`
    ADD COLUMN `adminSeenAt` DATETIME(3) NULL;

ALTER TABLE `support_conversations`
    ADD COLUMN `adminSeenAt` DATETIME(3) NULL;

UPDATE `orders` SET `adminSeenAt` = UTC_TIMESTAMP(3) WHERE `adminSeenAt` IS NULL;

UPDATE `support_conversations` SET `adminSeenAt` = UTC_TIMESTAMP(3) WHERE `adminSeenAt` IS NULL;
