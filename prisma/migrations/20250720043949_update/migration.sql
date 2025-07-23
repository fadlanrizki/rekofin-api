/*
  Warnings:

  - You are about to drop the `FinancialInput` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistoryRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `FinancialInput` DROP FOREIGN KEY `FinancialInput_userId_fkey`;

-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `History_financialInputId_fkey`;

-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `History_userId_fkey`;

-- DropForeignKey
ALTER TABLE `HistoryRecommendation` DROP FOREIGN KEY `HistoryRecommendation_historyId_fkey`;

-- DropForeignKey
ALTER TABLE `HistoryRecommendation` DROP FOREIGN KEY `HistoryRecommendation_recommendationId_fkey`;

-- DropTable
DROP TABLE `FinancialInput`;

-- DropTable
DROP TABLE `History`;

-- DropTable
DROP TABLE `HistoryRecommendation`;

-- DropTable
DROP TABLE `Recommendation`;

-- DropTable
DROP TABLE `Rule`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `financial_input` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `monthlyIncome` DOUBLE NOT NULL,
    `totalSavings` DOUBLE NOT NULL,
    `emergencyFund` DOUBLE NOT NULL,
    `debt` DOUBLE NOT NULL,
    `monthlyExpenses` DOUBLE NOT NULL,
    `riskProfile` ENUM('conservative', 'moderate', 'aggressive') NOT NULL,
    `financialPrinciple` ENUM('syariah', 'conventional', 'both') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `conditions` JSON NOT NULL,
    `categoryResult` ENUM('menabung', 'dana_darurat', 'investasi') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` ENUM('menabung', 'dana_darurat', 'investasi') NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `sourceType` ENUM('book', 'educational', 'influencer') NOT NULL,
    `sourceName` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `financialInputId` INTEGER NOT NULL,
    `categoryResult` ENUM('menabung', 'dana_darurat', 'investasi') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `history_recommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recommendationId` INTEGER NOT NULL,
    `historyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `history_recommendation_recommendationId_historyId_key`(`recommendationId`, `historyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `financial_input` ADD CONSTRAINT `financial_input_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_financialInputId_fkey` FOREIGN KEY (`financialInputId`) REFERENCES `financial_input`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_recommendation` ADD CONSTRAINT `history_recommendation_recommendationId_fkey` FOREIGN KEY (`recommendationId`) REFERENCES `recommendation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history_recommendation` ADD CONSTRAINT `history_recommendation_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
