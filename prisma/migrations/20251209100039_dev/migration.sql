-- CreateTable
CREATE TABLE `TutorRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contactMethod` ENUM('MAIL', 'TEAMS', 'DISCORD') NOT NULL,
    `contactHandle` VARCHAR(191) NULL,
    `cursus` ENUM('DEV_APPS', 'SEC_SY', 'AI') NOT NULL,
    `courses` JSON NOT NULL,
    `details` VARCHAR(191) NULL,
    `status` ENUM('EN_ATTENTE', 'MATCH_PROPOSE', 'MATCH_CONFIRME', 'CLOS') NOT NULL DEFAULT 'EN_ATTENTE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TutorRequest_cursus_status_idx`(`cursus`, `status`),
    INDEX `TutorRequest_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TutorOffer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contactMethod` ENUM('MAIL', 'TEAMS', 'DISCORD') NOT NULL,
    `contactHandle` VARCHAR(191) NULL,
    `cursus` ENUM('DEV_APPS', 'SEC_SY', 'AI') NOT NULL,
    `courses` JSON NOT NULL,
    `details` VARCHAR(191) NULL,
    `status` ENUM('DISPO', 'PROPOSE', 'ASSIGNE', 'INDISPO') NOT NULL DEFAULT 'DISPO',
    `assignments` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TutorOffer_cursus_status_idx`(`cursus`, `status`),
    INDEX `TutorOffer_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutorRequestId` INTEGER NOT NULL,
    `tutorOfferId` INTEGER NOT NULL,
    `status` ENUM('PENDING_TUTOR', 'CONFIRMED', 'DECLINED') NOT NULL DEFAULT 'PENDING_TUTOR',
    `token` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `confirmedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Match_token_key`(`token`),
    INDEX `Match_tutorRequestId_idx`(`tutorRequestId`),
    INDEX `Match_tutorOfferId_idx`(`tutorOfferId`),
    INDEX `Match_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_tutorRequestId_fkey` FOREIGN KEY (`tutorRequestId`) REFERENCES `TutorRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_tutorOfferId_fkey` FOREIGN KEY (`tutorOfferId`) REFERENCES `TutorOffer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
