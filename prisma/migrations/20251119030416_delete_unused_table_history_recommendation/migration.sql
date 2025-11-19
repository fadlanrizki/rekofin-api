/*
  Warnings:

  - You are about to drop the column `financialInputId` on the `history` table. All the data in the column will be lost.
  - You are about to drop the `financial_input` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `history_recommendation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `financialId` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `financial_input` DROP FOREIGN KEY `financial_input_userId_fkey`;

-- DropForeignKey
ALTER TABLE `history` DROP FOREIGN KEY `history_financialInputId_fkey`;

-- DropForeignKey
ALTER TABLE `history_recommendation` DROP FOREIGN KEY `history_recommendation_historyId_fkey`;

-- DropForeignKey
ALTER TABLE `history_recommendation` DROP FOREIGN KEY `history_recommendation_recommendationId_fkey`;

-- DropIndex
DROP INDEX `history_financialInputId_fkey` ON `history`;

-- AlterTable
ALTER TABLE `history` DROP COLUMN `financialInputId`,
    ADD COLUMN `financialId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `financial_input`;

-- DropTable
DROP TABLE `history_recommendation`;

-- CreateTable
CREATE TABLE `financial` (
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

-- AddForeignKey
ALTER TABLE `financial` ADD CONSTRAINT `financial_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `history` ADD CONSTRAINT `history_financialId_fkey` FOREIGN KEY (`financialId`) REFERENCES `financial`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
