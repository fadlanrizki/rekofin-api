/*
  Warnings:

  - You are about to drop the `financial_fact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recommendation_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recommendation_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `financial_fact` DROP FOREIGN KEY `financial_fact_userId_fkey`;

-- DropForeignKey
ALTER TABLE `recommendation` DROP FOREIGN KEY `recommendation_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `recommendation_history` DROP FOREIGN KEY `recommendation_history_recommendationId_fkey`;

-- DropForeignKey
ALTER TABLE `recommendation_history` DROP FOREIGN KEY `recommendation_history_userId_fkey`;

-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `role_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `role_createdBy_fkey`;

-- DropTable
DROP TABLE `financial_fact`;

-- DropTable
DROP TABLE `recommendation`;

-- DropTable
DROP TABLE `recommendation_category`;

-- DropTable
DROP TABLE `recommendation_history`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinancialInput` (
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
CREATE TABLE `Rule` (
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
CREATE TABLE `Recommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` ENUM('menabung', 'dana_darurat', 'investasi') NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `sourceType` ENUM('book', 'educational', 'influencer') NOT NULL,
    `sourceName` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `financialInputId` INTEGER NOT NULL,
    `categoryResult` ENUM('menabung', 'dana_darurat', 'investasi') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoryRecommendation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recommendationId` INTEGER NOT NULL,
    `historyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `HistoryRecommendation_recommendationId_historyId_key`(`recommendationId`, `historyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FinancialInput` ADD CONSTRAINT `FinancialInput_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_financialInputId_fkey` FOREIGN KEY (`financialInputId`) REFERENCES `FinancialInput`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoryRecommendation` ADD CONSTRAINT `HistoryRecommendation_recommendationId_fkey` FOREIGN KEY (`recommendationId`) REFERENCES `Recommendation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoryRecommendation` ADD CONSTRAINT `HistoryRecommendation_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `History`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
