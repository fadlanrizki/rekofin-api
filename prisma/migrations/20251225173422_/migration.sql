/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `admins` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `admins` MODIFY `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `admins_username_key` ON `admins`(`username`);
